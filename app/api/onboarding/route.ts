import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const [user, nextBooking, checkIns] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          phone: true,
          plan: { select: { id: true, name: true } },
        },
      }),
      prisma.booking.findFirst({
        where: {
          userId: session.user.id,
          schedulingDate: { gte: new Date() },
          status: { in: ["confirmado", "pendente"] },
        },
        orderBy: { schedulingDate: "asc" },
        select: {
          id: true,
          schedulingDate: true,
          status: true,
          class: { select: { name: true } },
        },
      }),
      prisma.checkIn.count({
        where: { booking: { userId: session.user.id }, present: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        hasPhone: Boolean(user.phone),
        plan: user.plan,
      },
      nextBooking,
      totalCheckIns: checkIns,
      completedSteps: {
        hasProfile: Boolean(user.name && user.email),
        hasPhone: Boolean(user.phone),
        hasPlan: Boolean(user.plan),
        hasBooking: Boolean(nextBooking),
        hasCheckIn: checkIns > 0,
      },
    });
  } catch (err) {
    console.error("[onboarding] erro ao carregar dados", err);
    return NextResponse.json(
      { error: "Não foi possível carregar seu progresso. Tente novamente." },
      { status: 500 }
    );
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/onboarding/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
