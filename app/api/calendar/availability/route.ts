import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get("classId");

    if (classId) {
      const targetClass = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          bookings: {
            include: { user: { select: { id: true, name: true, email: true } } }
          }
        }
      });

      if (!targetClass) {
        return NextResponse.json({ error: "Turma não encontrada" }, { status: 404 });
      }

      const occupied = targetClass.bookings.length;
      const availableSpots = Math.max(0, targetClass.capacity - occupied);

      return NextResponse.json({
        class: targetClass,
        capacity: targetClass.capacity,
        occupiedSpots: occupied,
        availableSpots,
        isFull: availableSpots === 0
      });
    }

    const allClasses = await prisma.class.findMany({
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    const summary = allClasses.map((cls) => ({
      id: cls.id,
      name: cls.name,
      type: cls.type,
      duration: cls.duration,
      capacity: cls.capacity,
      bookedCount: cls._count.bookings,
      availableSpots: Math.max(0, cls.capacity - cls._count.bookings)
    }));

    return NextResponse.json({ success: true, classes: summary });
  } catch (error: any) {
    console.error("Erro ao buscar disponibilidade:", error);
    return NextResponse.json({ error: "Erro interno ao buscar disponibilidade" }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/calendar/availability/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
