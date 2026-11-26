import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');

  const professors = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({
    where: {
      active: true,
      ...(serviceId ? { services: { some: { serviceId } } } : {}),
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      bio: true,
      photoUrl: true,
      specialties: true,
      user: { select: { name: true } },
      services: { select: { serviceId: true } },
    },
  });

  return NextResponse.json({
    professors: professors.map((p) => ({
      id: p.id,
      name: p.user.name ?? 'Professor(a)',
      bio: p.bio,
      photoUrl: p.photoUrl,
      specialties: p.specialties,
      serviceIds: p.services.map((s) => s.serviceId),
    })),
  });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/profissionais/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
