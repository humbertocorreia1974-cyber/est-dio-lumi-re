import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import ASSETS from "@/lib/assets";
import BookingActions from "./booking-actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detalhe do Agendamento | Estúdio Lumière",
  description: "Veja os detalhes do seu agendamento no Estúdio Lumière: aula, horário, profissional, código de confirmação e opções de remarcar ou cancelar.",
  openGraph: {
    title: "Detalhe do Agendamento | Estúdio Lumière",
    description: "Detalhes completos do seu agendamento no Estúdio Lumière.",
    images: [ASSETS.hero],
  },
};

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmado", cls: "bg-brand/10 text-brand" },
  pending: { label: "Aguardando confirmação", cls: "bg-accent/15 text-accent" },
  cancelled: { label: "Cancelado", cls: "bg-fg-muted/10 text-fg-muted" },
  completed: { label: "Concluído", cls: "bg-brand/15 text-brand" },
  no_show: { label: "Não compareceu", cls: "bg-red-500/10 text-red-600" },
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function DetalheAgendamentoPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/entrar?callbackUrl=/meus-agendamentos/${params.id}`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      class: true,
      payment: true,
      checkIn: true,
      progress: { orderBy: { registerDate: "desc" }, take: 5 },
    },
  });

  if (!booking) {
    notFound();
  }

  const isAdmin =
    session.user.role === "admin" ||
    session.user.role === "dono" ||
    session.user.role === "recepcao";
  if (booking.userId !== session.user.id && !isAdmin) {
    redirect("/meus-agendamentos");
  }

  const status = STATUS_LABEL[booking.status] ?? {
    label: booking.status,
    cls: "bg-fg-muted/10 text-fg-muted",
  };
  const horasAte = (new Date(booking.schedulingDate).getTime() - Date.now()) / 36e5;
  const podeCancelar = booking.status !== "cancelled" && booking.status !== "completed" && horasAte >= 4;
  const podeRemarcar = booking.status !== "cancelled" && booking.status !== "completed";

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal variant="up">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/meus-agendamentos"
              className="text-sm text-fg-muted hover:text-brand transition-colors"
            >
              ← Voltar para meus agendamentos
            </Link>
            <h1 className="mt-3 font-display text-4xl text-fg sm:text-5xl">
              Detalhe do agendamento
            </h1>
            <p className="mt-2 text-fg-muted">
              Código de confirmação: <span className="font-mono text-fg">{booking.confirmationCode}</span>
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.cls}`}>
            {status.label}
          </span>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        <Reveal variant="left" className="md:col-span-2">
          <Card>
            <CardTitle>{booking.class.name}</CardTitle>
            <CardBody>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-fg-muted">Data e horário</dt>
                  <dd className="mt-1 text-fg">{formatDate(new Date(booking.schedulingDate))}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-fg-muted">Duração</dt>
                  <dd className="mt-1 text-fg">{booking.class.duration} minutos</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-fg-muted">Modalidade</dt>
                  <dd className="mt-1 text-fg">{booking.class.type}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-fg-muted">Nível</dt>
                  <dd className="mt-1 text-fg">{booking.class.level}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-fg-muted">Valor</dt>
                  <dd className="mt-1 text-fg">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                      Number(booking.price)
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-fg-muted">Pagamento</dt>
                  <dd className="mt-1 text-fg">
                    {booking.payment
                      ? `${booking.payment.method} · ${booking.payment.status}`
                      : "A combinar na recepção"}
                  </dd>
                </div>
              </dl>

              {booking.observations && (
                <div className="mt-6 rounded-lg border border-border p-4">
                  <p className="text-xs uppercase tracking-wide text-fg-muted">Observações</p>
                  <p className="mt-1 text-sm text-fg">{booking.observations}</p>
                </div>
              )}

              {booking.class.description && (
                <p className="mt-6 text-sm leading-relaxed text-fg-muted">
                  {booking.class.description}
                </p>
              )}
            </CardBody>
          </Card>
        </Reveal>

        <Reveal variant="right" delay={80}>
          <Card>
            <CardTitle>Ações</CardTitle>
            <CardBody>
              <BookingActions
                bookingId={booking.id}
                podeCancelar={podeCancelar}
                podeRemarcar={podeRemarcar}
                dataAtual={new Date(booking.schedulingDate).toISOString()}
              />
              {!podeCancelar && booking.status !== "cancelled" && booking.status !== "completed" && (
                <p className="mt-4 text-xs text-fg-muted">
                  Cancelamento só é permitido até 4 horas antes da aula. Fale com a recepção pelo WhatsApp.
                </p>
              )}
            </CardBody>
          </Card>
        </Reveal>
      </div>

      {booking.checkIn && (
        <Reveal variant="up" delay={120}>
          <Card className="mt-6">
            <CardTitle>Check-in</CardTitle>
            <CardBody>
              <p className="text-sm text-fg">
                {booking.checkIn.present ? "Presença registrada" : "Ausência registrada"} em{" "}
                {new Date(booking.checkIn.date).toLocaleDateString("pt-BR")} às {booking.checkIn.hour}.
              </p>
              {booking.checkIn.observations && (
                <p className="mt-2 text-sm text-fg-muted">{booking.checkIn.observations}</p>
              )}
            </CardBody>
          </Card>
        </Reveal>
      )}

      {booking.progress.length > 0 && (
        <Reveal variant="up" delay={160}>
          <Card className="mt-6">
            <CardTitle>Evolução registrada</CardTitle>
            <CardBody>
              <ul className="divide-y divide-border">
                {booking.progress.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-fg-muted">
                      {new Date(p.registerDate).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="text-fg">
                      {p.weight ? `${Number(p.weight).toFixed(1)} kg` : ""}
                      {p.fatPercentage ? ` · ${Number(p.fatPercentage).toFixed(1)}% gordura` : ""}
                      {p.level ? ` · ${p.level}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Reveal>
      )}

      <Reveal variant="up" delay={200}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/agendamento">
            <Button variant="primary">Agendar nova aula</Button>
          </Link>
          <Link href="/meus-agendamentos">
            <Button variant="secondary">Ver todos os agendamentos</Button>
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
