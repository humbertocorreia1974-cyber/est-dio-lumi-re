import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!["aluno","professor","recepção","dono","admin","master","owner","superadmin"].includes((session?.user as any)?.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });
  }

  const ultimo = await prisma.payment.findFirst({
    where: { planId: { not: null }, status: 'pago', bookingId: null },
    orderBy: { paymentDate: 'desc' },
  });

  if (!ultimo) {
    return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada.' }, { status: 404 });
  }

  await prisma.payment.update({
    where: { id: ultimo.id },
    data: { status: 'cancelado' },
  });

  return NextResponse.json({ ok: true });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/meu-plano/cancelar/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
