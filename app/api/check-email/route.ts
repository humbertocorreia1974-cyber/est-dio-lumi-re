import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
  const __session = await getServerSession(authOptions as any);
  if (!(__session as any)?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const email = (searchParams.get('email') || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ available: false, error: 'E-mail inválido.' }, { status: 400 });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    return NextResponse.json({ available: !existing });
  } catch {
    return NextResponse.json({ available: false, error: 'Não foi possível verificar agora.' }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/check-email/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
