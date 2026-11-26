import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function codigo(): string {
  return 'LUM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function POST(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para agendar.' }, { status: 401 });
  }

  let body: { classId?: string; date?: string; hora?: string; observations?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  const { classId, date, hora, observations } = body;
  if (!classId || !date || !hora) {
    return NextResponse.json({ error: 'Escolha a aula, a data e o horário.' }, { status: 400 });
  }

  const aula = await prisma.class.findUnique({ where: { id: classId } });
  if (!aula) {
    return NextResponse.json({ error: 'Aula não encontrada.' }, { status: 404 });
  }

  const schedulingDate = new Date(`${date}T${hora}:00`);
  if (Number.isNaN(schedulingDate.getTime())) {
    return NextResponse.json({ error: 'Data ou horário inválidos.' }, { status: 400 });
  }
  if (schedulingDate.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Escolha um horário no futuro.' }, { status: 400 });
  }

  const dayStart = new Date(schedulingDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(schedulingDate);
  dayEnd.setHours(23, 59, 59, 999);

  const mesmoHorario = await prisma.booking.findFirst({
    where: {
      classId,
      schedulingDate,
      status: { in: ['confirmado', 'pendente', 'concluido'] },
    },
  });
  if (mesmoHorario) {
    return NextResponse.json({ error: 'Esse horário acabou de ser ocupado. Escolha outro.' }, { status: 409 });
  }

  const doDia = await prisma.booking.count({
    where: {
      classId,
      schedulingDate: { gte: dayStart, lte: dayEnd },
      status: { in: ['confirmado', 'pendente', 'concluido'] },
    },
  });
  if (doDia >= aula.capacity) {
    return NextResponse.json({ error: 'Turma cheia nesse dia. Tente outra data.' }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      schedulingDate,
      status: 'confirmado',
      price: 0,
      observations: observations?.trim() || null,
      confirmationCode: codigo(),
      classId,
      userId: session.user.id,
    },
  });

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Agendamento confirmado: ${aula.name}`,
        html: `<p>Olá, ${user.name ?? 'aluno(a)'}.</p>
          <p>Seu horário em <strong>${aula.name}</strong> está confirmado.</p>
          <p>Data: <strong>${schedulingDate.toLocaleDateString('pt-BR')}</strong> às <strong>${hora}</strong></p>
          <p>Código de confirmação: <strong>${booking.confirmationCode}</strong></p>
          <p>Estúdio Lumière</p>`,
      });
    }
  } catch {
    // envio de e-mail não deve bloquear a confirmação
  }

  return NextResponse.json({ ok: true, id: booking.id, code: booking.confirmationCode });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamentos/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
