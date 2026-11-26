export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { bookingId, observations } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "ID do agendamento obrigatório" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { checkIn: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Agendamento não encontrado" }, { status: 404 });
    }

    if (booking.userId !== session.user.id && session.user.role !== "admin" && session.user.role !== "professor" && session.user.role !== "recepcao") {
      return NextResponse.json({ error: "Sem permissão para realizar este check-in" }, { status: 403 });
    }

    if (booking.checkIn) {
      return NextResponse.json({ error: "Check-in já realizado para esta aula" }, { status: 400 });
    }

    const now = new Date();
    const hourStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const checkIn = await prisma.checkIn.create({
      data: {
        bookingId,
        date: now,
        hour: hourStr,
        present: true,
        observations: observations || "Check-in realizado com sucesso",
      },
    });

    return NextResponse.json({ success: true, checkIn });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/checkin/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
