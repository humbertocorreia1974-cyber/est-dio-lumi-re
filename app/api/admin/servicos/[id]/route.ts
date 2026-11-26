import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  if (role !== 'admin' && role !== 'dono') {
    return NextResponse.json({ error: 'Sem permissão para esta ação.' }, { status: 403 });
  }

  const exists = await prisma.class.findUnique({ where: { id: params.id } });
  if (!exists) {
    return NextResponse.json({ error: 'Serviço não encontrado.' }, { status: 404 });
  }

  await prisma.class.update({
    where: { id: params.id },
    data: { capacity: 0 },
  });

  return NextResponse.json({ ok: true });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/admin/servicos/[id]/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}