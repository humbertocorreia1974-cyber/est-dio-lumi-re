import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const bookingId = params.id;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: "Agendamento não encontrado ou sem permissão" }, { status: 404 });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "cancelado" },
    });

    return NextResponse.redirect(new URL("/meus-agendamentos", request.url), {
      status: 303,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cancelar agendamento" }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/bookings/[id]/cancel/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
