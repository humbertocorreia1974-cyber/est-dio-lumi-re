import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { class: true },
  });

  if (!booking || booking.userId !== session.user.id) {
    return new Response("Agendamento não encontrado", { status: 404 });
  }

  const inicio = booking.schedulingDate;
  const fim = new Date(inicio.getTime() + booking.class.duration * 60 * 1000);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Estudio Lumiere//Agendamento//PT-BR",
    "BEGIN:VEVENT",
    `UID:${booking.id}@estudiolumiere`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(inicio)}`,
    `DTEND:${fmt(fim)}`,
    `SUMMARY:${booking.class.name} · Estúdio Lumière`,
    `DESCRIPTION:Código ${booking.confirmationCode}. Chegue com 10 minutos de antecedência.`,
    "LOCATION:Estúdio Lumière",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="lumiere-${booking.confirmationCode}.ics"`,
    },
  });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamento/[id]/ics/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
