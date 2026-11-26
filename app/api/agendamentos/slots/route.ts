import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const SLOT_STEP_MIN = 30;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
}

function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export async function GET(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Faça login para ver horários.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const classId = url.searchParams.get('classId');
  const dateStr = url.searchParams.get('date');

  if (!classId || !dateStr) {
    return NextResponse.json({ error: 'Informe a aula e a data.' }, { status: 400 });
  }

  const aula = await prisma.class.findUnique({ where: { id: classId } });
  if (!aula) {
    return NextResponse.json({ error: 'Aula não encontrada.' }, { status: 404 });
  }

  const day = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(day.getTime())) {
    return NextResponse.json({ error: 'Data inválida.' }, { status: 400 });
  }

  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(day);
  dayEnd.setHours(23, 59, 59, 999);

  const ocupados = await prisma.booking.findMany({
    where: {
      classId,
      schedulingDate: { gte: dayStart, lte: dayEnd },
      status: { in: ['confirmado', 'pendente', 'concluido'] },
    },
    select: { schedulingDate: true },
  });

  const taken = new Set(ocupados.map((b) => toHHMM(b.schedulingDate.getHours() * 60 + b.schedulingDate.getMinutes())));

  const abertura = 7 * 60;
  const fechamento = 21 * 60;
  const almocoInicio = 12 * 60;
  const almocoFim = 13 * 60;

  const slots: { hora: string; disponivel: boolean }[] = [];
  for (let m = abertura; m + aula.duration <= fechamento; m += SLOT_STEP_MIN) {
    const dentroAlmoco = m < almocoFim && m + aula.duration > almocoInicio;
    const hora = toHHMM(m);
    slots.push({ hora, disponivel: !dentroAlmoco && !taken.has(hora) });
  }

  return NextResponse.json({ slots, duracao: aula.duration, capacidade: aula.capacity });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamentos/slots/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
