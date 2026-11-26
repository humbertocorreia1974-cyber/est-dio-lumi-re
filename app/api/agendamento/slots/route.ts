import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ABERTURA = 7;
const FECHAMENTO = 21;
const ALMOCO_INI = 12;
const ALMOCO_FIM = 13;
const PASSO_MIN = 30;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function GET(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  const data = searchParams.get("data");
  const professionalId = searchParams.get("professionalId") || "";

  if (!classId || !data) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const cls = await prisma.class.findUnique({ where: { id: classId } });
  if (!cls) {
    return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
  }

  const dia = new Date(`${data}T00:00:00`);
  if (isNaN(dia.getTime())) {
    return NextResponse.json({ error: "Data inválida" }, { status: 400 });
  }
  const inicioDia = new Date(dia);
  const fimDia = new Date(dia);
  fimDia.setDate(fimDia.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      classId,
      schedulingDate: { gte: inicioDia, lt: fimDia },
      status: { in: ["confirmado", "pendente"] },
    },
    select: { schedulingDate: true, status: true },
  });

  const ocupados = bookings.map((b) => {
    const d = new Date(b.schedulingDate);
    return d.getHours() * 60 + d.getMinutes();
  });

  const agora = new Date();
  const hoje = new Date();
  const isHoje =
    hoje.getFullYear() === dia.getFullYear() &&
    hoje.getMonth() === dia.getMonth() &&
    hoje.getDate() === dia.getDate();
  const agoraMin = agora.getHours() * 60 + agora.getMinutes();

  const slots: { hora: string; disponivel: boolean }[] = [];
  for (let m = ABERTURA * 60; m + cls.duration <= FECHAMENTO * 60; m += PASSO_MIN) {
    if (m >= ALMOCO_INI * 60 && m < ALMOCO_FIM * 60) continue;
    const conflito = ocupados.some(
      (o) => m < o + cls.duration && m + cls.duration > o
    );
    const passado = isHoje && m <= agoraMin + 30;
    slots.push({
      hora: toHHMM(m),
      disponivel: !conflito && !passado,
    });
  }

  return NextResponse.json({ slots, professionalId: professionalId || null });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamento/slots/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
