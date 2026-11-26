import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function gerarCodigo() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let body: {
    classId?: string;
    professionalId?: string | null;
    data?: string;
    hora?: string;
    observations?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const { classId, data, hora } = body;
  if (!classId || !data || !hora) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls) {
    return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
  }

  const [hh, mm] = hora.split(":").map(Number);
  const when = new Date(`${data}T00:00:00`);
  when.setHours(hh, mm, 0, 0);
  if (isNaN(when.getTime()) || when.getTime() < Date.now()) {
    return NextResponse.json({ error: "Horário inválido" }, { status: 400 });
  }

  const inicioDia = new Date(when);
  inicioDia.setHours(0, 0, 0, 0);
  const fimDia = new Date(inicioDia);
  fimDia.setDate(fimDia.getDate() + 1);

  const existentes = await prisma.booking.findMany({
    where: {
      classId,
      schedulingDate: { gte: inicioDia, lt: fimDia },
      status: { in: ["confirmado", "pendente"] },
    },
    select: { schedulingDate: true },
  });

  const startMin = hh * 60 + mm;
  const endMin = startMin + cls.duration;
  const conflito = existentes.some((b) => {
    const d = new Date(b.schedulingDate);
    const o = d.getHours() * 60 + d.getMinutes();
    return startMin < o + cls.duration && endMin > o;
  });
  if (conflito) {
    return NextResponse.json(
      { error: "Este horário acabou de ser reservado. Escolha outro." },
      { status: 409 }
    );
  }

  const price = cls.duration >= 60 ? 120 : 90;
  const confirmationCode = gerarCodigo();

  const booking = await prisma.booking.create({
    data: {
      schedulingDate: when,
      status: "confirmado",
      price,
      observations: body.observations || null,
      confirmationCode,
      classId,
      userId: session.user.id,
    },
  });

  const whenLabel = when.toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  try {
    if (session.user.email) {
      await sendEmail({
        to: session.user.email,
        subject: `Reserva confirmada: ${cls.name} em ${whenLabel}`,
        html: `<p>Olá, ${session.user.name || "aluno(a)"}.</p>
<p>Sua reserva no Estúdio Lumière está confirmada.</p>
<p><strong>${cls.name}</strong><br/>${whenLabel}<br/>Código: <strong>${confirmationCode}</strong></p>
<p>Se precisar remarcar, acesse Meus Agendamentos com pelo menos 4 horas de antecedência.</p>`,
      });
    }
  } catch {
    // envio de e-mail não bloqueia a reserva
  }

  return NextResponse.json({
    id: booking.id,
    confirmationCode,
    when: whenLabel,
  });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamento/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
