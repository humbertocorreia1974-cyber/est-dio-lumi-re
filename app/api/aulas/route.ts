import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const level = searchParams.get('level');

    const where: any = {};
    if (type) where.type = type;
    if (level) where.level = level;

    const classes = await prisma.class.findMany({
      where,
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    return NextResponse.json({ error: 'Erro interno ao buscar aulas' }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/aulas/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}

export async function POST(request: Request) {
  try {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'dono')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, duration, level, description, capacity } = body;

    if (!name || !type || !duration || !level || !capacity) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        type,
        duration: parseInt(duration),
        level,
        description: description || '',
        capacity: parseInt(capacity),
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    return NextResponse.json({ error: 'Erro interno ao criar aula' }, { status: 500 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/aulas/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
