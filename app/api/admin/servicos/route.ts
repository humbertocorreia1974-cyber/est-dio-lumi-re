import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });
  }
  if (session.user.role !== 'admin' && session.user.role !== 'dono') {
    return NextResponse.json({ error: 'Sem permissão para esta ação.' }, { status: 403 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  const name = String(body?.name ?? '').trim();
  const type = String(body?.type ?? '').trim();
  const level = String(body?.level ?? '').trim();
  const description = String(body?.description ?? '').trim();
  const duration = Number(body?.duration);
  const capacity = Number(body?.capacity);

  if (!name || !type || !level || !description) {
    return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
  }
  if (!Number.isFinite(duration) || duration < 15) {
    return NextResponse.json({ error: 'Duração mínima de 15 minutos.' }, { status: 400 });
  }
  if (!Number.isFinite(capacity) || capacity < 1) {
    return NextResponse.json({ error: 'Capacidade mínima de 1 pessoa.' }, { status: 400 });
  }

  const created = await prisma.class.create({
    data: { name, type, level, description, duration, capacity },
  });

  return NextResponse.json({ ok: true, id: created.id });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/admin/servicos/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
