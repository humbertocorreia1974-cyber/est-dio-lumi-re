import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'Não autenticado', status: 401 as const };
  if (session.user.role !== 'admin' && session.user.role !== 'dono') {
    return { error: 'Sem permissão', status: 403 as const };
  }
  return { session };
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
  const check = await requireAdmin();
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 });
  }

  const data: Record<string, any> = {};
  if (typeof body?.name === 'string') data.name = body.name.trim();
  if (typeof body?.specialty === 'string') data.specialty = body.specialty.trim();
  if (typeof body?.bio === 'string') data.bio = body.bio.trim() || null;
  if (typeof body?.photoUrl === 'string') data.photoUrl = body.photoUrl.trim() || null;
  if (typeof body?.active === 'boolean') data.active = body.active;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 });
  }

  try {
    const professional = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ professional });
  } catch {
    return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/profissionais/[id]/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
  const check = await requireAdmin();
  if ('error' in check) return NextResponse.json({ error: check.error }, { status: check.status });

  try {
    await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).update({
      where: { id: params.id },
      data: { active: false },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/profissionais/[id]/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
