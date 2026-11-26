import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function gerarCodigo() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return out;
}

export async function POST(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Faça login para confirmar o agendamento." }, { status: 401 });
  }

  let body: {
    classId?: string;
    schedulingDate?: string;
    observations?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { classId, schedulingDate, observations } = body;
  if (!classId || !schedulingDate) {
    return NextResponse.json({ error: "Escolha uma aula e um horário." }, { status: 400 });
  }

  const data = new Date(schedulingDate);
  if (Number.isNaN(data.getTime())) {
    return NextResponse.json({ error: "Data do agendamento inválida." }, { status: 400 });
  }
  if (data.getTime() < Date.now()) {
    return NextResponse.json({ error: "Escolha um horário no futuro." }, { status: 400 });
  }

  const aula = await prisma.class.findUnique({ where: { id: classId } });
  if (!aula) {
    return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
  }

  const conflito = await prisma.booking.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ["confirmado", "pendente"] },
      schedulingDate: {
        gte: new Date(data.getTime() - aula.duration * 60 * 1000),
        lte: new Date(data.getTime() + aula.duration * 60 * 1000),
      },
    },
  });
  if (conflito) {
    return NextResponse.json(
      { error: "Você já tem um agendamento nesse horário. Escolha outro." },
      { status: 409 }
    );
  }

  const ocupados = await prisma.booking.count({
    where: {
      classId,
      status: { in: ["confirmado", "pendente"] },
      schedulingDate: data,
    },
  });
  if (ocupados >= aula.capacity) {
    return NextResponse.json({ error: "Essa turma já está lotada. Escolha outro horário." }, { status: 409 });
  }

  const booking = await prisma.booking.create({
    data: {
      userId: session.user.id,
      classId,
      schedulingDate: data,
      status: "confirmado",
      price: 0,
      observations: observations?.trim() || null,
      confirmationCode: gerarCodigo(),
    },
    include: { class: true },
  });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.email) {
    const quando = data.toLocaleString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    });
    try {
      await sendEmail({
        to: user.email,
        subject: `Agendamento confirmado: ${aula.name}`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;color:#1f2937;line-height:1.6">
            <h2 style="font-family:Georgia,serif;color:#1e3a5f">Estúdio Lumière</h2>
            <p>Olá, ${user.name ?? "aluno(a)"}.</p>
            <p>Seu horário está reservado.</p>
            <p><strong>Aula:</strong> ${aula.name}<br/>
            <strong>Quando:</strong> ${quando}<br/>
            <strong>Código:</strong> ${booking.confirmationCode}</p>
            <p>Chegue com 10 minutos de antecedência. Se precisar remarcar, faça pelo app até 4 horas antes.</p>
            <p style="color:#6b7280;font-size:13px">Estúdio Lumière · Agende com serenidade</p>
          </div>
        `,
      });
    } catch {
      // falha de e-mail não bloqueia a confirmação
    }
  }

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    confirmationCode: booking.confirmationCode,
  });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamento/confirmar/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
