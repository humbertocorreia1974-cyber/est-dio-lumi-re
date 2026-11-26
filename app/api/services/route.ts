import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const services = await prisma.class.findMany({
      where: type ? { type } : undefined,
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível carregar os serviços agora. Tente de novo em instantes.' },
      { status: 500 }
    );
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/services/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}

export async function POST(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });
  }
  if (session.user.role !== 'admin' && session.user.role !== 'dono') {
    return NextResponse.json(
      { error: 'Apenas a administração do estúdio pode cadastrar serviços.' },
      { status: 403 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const type = typeof body.type === 'string' ? body.type.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const level = typeof body.level === 'string' ? body.level.trim() : 'Todos os níveis';
  const duration = Number(body.duration);
  const capacity = Number(body.capacity);

  if (!name || !type || !description) {
    return NextResponse.json(
      { error: 'Preencha nome, modalidade e descrição do serviço.' },
      { status: 400 }
    );
  }
  if (!Number.isFinite(duration) || duration <= 0 || duration > 240) {
    return NextResponse.json(
      { error: 'A duração precisa estar entre 1 e 240 minutos.' },
      { status: 400 }
    );
  }
  if (!Number.isFinite(capacity) || capacity <= 0 || capacity > 60) {
    return NextResponse.json(
      { error: 'A capacidade da turma precisa estar entre 1 e 60 pessoas.' },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.class.create({
      data: {
        name,
        type,
        description,
        level,
        duration: Math.round(duration),
        capacity: Math.round(capacity),
      },
    });
    return NextResponse.json({ service: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Não conseguimos salvar o serviço. Tente de novo.' },
      { status: 500 }
    );
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/services/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
