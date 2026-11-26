import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
  const __session = await getServerSession(authOptions as any);
  if (!(__session as any)?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const [studio, planos] = await Promise.all([
      prisma.studioInfo.findFirst({
        select: { id: true, name: true, address: true, phone: true, email: true, workingHours: true },
      }),
      prisma.plan.findMany({
        where: { active: true },
        orderBy: { price: 'asc' },
        select: { id: true, name: true, price: true, description: true, limitClassesPerMonth: true },
      }),
    ]);

    return NextResponse.json({ studio, planos });
  } catch (error) {
    return NextResponse.json(
      { error: 'Não foi possível carregar os dados do estúdio agora. Tente novamente.' },
      { status: 500 },
    );
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/studio/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
