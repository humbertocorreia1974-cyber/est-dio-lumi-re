import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, professionalId, schedulingDate, observations } = body;

    if (!serviceId || !professionalId || !schedulingDate) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const service = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
    }

    const confirmationCode = "LUMI-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    const booking = await prisma.booking.create({
      data: {
        schedulingDate: new Date(schedulingDate),
        serviceId,
        professionalId,
        userId: user.id,
        price: service.price,
        observations,
        confirmationCode,
        status: "confirmed"
      }
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `Seu agendamento para ${service.name} foi confirmado com sucesso. Código: ${confirmationCode}`
      }
    });

    return NextResponse.json({ success: true, confirmationCode: booking.confirmationCode });
  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro interno ao processar agendamento." }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/bookings/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}

export async function GET(request: Request) {
  try {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: user.role === "admin" ? {} : { userId: user.id },
      include: {
        service: true,
        professional: true,
        user: { select: { name: true, email: true } }
      },
      orderBy: { schedulingDate: "desc" }
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json({ error: "Erro interno ao buscar agendamentos." }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/bookings/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
