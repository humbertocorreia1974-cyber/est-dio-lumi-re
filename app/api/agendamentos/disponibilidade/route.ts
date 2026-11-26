import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const OPEN_HOUR = 7;
const CLOSE_HOUR = 20;
const LUNCH_START = 12;
const LUNCH_END = 13;

export async function GET(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');
  const professorId = searchParams.get('professorId');
  const dateStr = searchParams.get('date');

  if (!serviceId || !professorId || !dateStr) {
    return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes.' }, { status: 400 });
  }

  const service = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findUnique({ where: { id: serviceId } });
  if (!service || !service.active) {
    return NextResponse.json({ error: 'Serviço indisponível.' }, { status: 404 });
  }

  const professor = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findUnique({
    where: { id: professorId },
    include: { services: true },
  });
  if (!professor || !professor.active) {
    return NextResponse.json({ error: 'Professor indisponível.' }, { status: 404 });
  }
  if (!professor.services.some((s) => s.serviceId === serviceId)) {
    return NextResponse.json({ error: 'Professor não atende este serviço.' }, { status: 400 });
  }

  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) {
    return NextResponse.json({ error: 'Data inválida.' }, { status: 400 });
  }
  const dayStart = new Date(y, m - 1, d, 0, 0, 0, 0);
  const dayEnd = new Date(y, m - 1, d, 23, 59, 59, 999);

  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        professorId,
        status: { in: ['confirmado', 'pendente'] },
        schedulingDate: { gte: dayStart, lte: dayEnd },
      },
      select: { schedulingDate: true, duration: true },
    }),
    ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({
      where: {
        professorId,
        start: { lte: dayEnd },
        end: { gte: dayStart },
      },
      select: { start: true, end: true },
    }),
  ]);

  const busy: { start: number; end: number }[] = [];
  for (const b of bookings) {
    const start = b.schedulingDate.getTime();
    busy.push({ start, end: start + b.duration * 60_000 });
  }
  for (const bl of blocks) {
    busy.push({ start: bl.start.getTime(), end: bl.end.getTime() });
  }

  const slots: { time: string; iso: string }[] = [];
  const now = Date.now();
  const durationMs = service.duration * 60_000;

  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    if (h >= LUNCH_START && h < LUNCH_END) continue;
    const slotStart = new Date(y, m - 1, d, h, 0, 0, 0).getTime();
    const slotEnd = slotStart + durationMs;
    if (slotStart < now) continue;
    if (slotEnd > new Date(y, m - 1, d, CLOSE_HOUR, 0, 0, 0).getTime()) continue;
    const conflict = busy.some((b) => slotStart < b.end && slotEnd > b.start);
    if (conflict) continue;
    slots.push({
      time: `${String(h).padStart(2, '0')}:00`,
      iso: new Date(slotStart).toISOString(),
    });
  }

  return NextResponse.json({ slots });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamentos/disponibilidade/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
