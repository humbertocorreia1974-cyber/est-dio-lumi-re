import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CalendarDays, Clock, MapPin, CheckCircle2, MessageCircle, Download, ArrowRight } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import ASSETS from "@/lib/assets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agendamento confirmado | Estúdio Lumière",
  description:
    "Seu horário no Estúdio Lumière está reservado. Confira o comprovante, adicione à sua agenda e veja seus próximos agendamentos.",
  openGraph: {
    title: "Agendamento confirmado | Estúdio Lumière",
    description: "Comprovante do seu horário reservado no Estúdio Lumière.",
    images: [ASSETS.hero],
  },
};

const TZ = "America/Sao_Paulo";

function formatarData(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  });
}

function formatarHora(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
}

export default async function Page({ searchParams }: { searchParams: { id?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/entrar?callbackUrl=/meus-agendamentos");
  }

  const booking = searchParams.id
    ? await prisma.booking.findUnique({
        where: { id: searchParams.id },
        include: { class: true },
      })
    : await prisma.booking.findFirst({
        where: { userId: session.user.id },
        orderBy: { schedulingDate: "desc" },
        include: { class: true },
      });

  if (!booking || booking.userId !== session.user.id) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <Card>
          <CardBody className="space-y-4 text-center">
            <h1 className="font-display text-3xl text-fg">Não encontramos esse agendamento</h1>
            <p className="text-fg-muted">
              Ele pode ter sido cancelado ou o link está incompleto. Veja todos os seus horários na sua área.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/meus-agendamentos">
                <Button variant="primary">Ver meus agendamentos</Button>
              </Link>
              <Link href="/agendamento">
                <Button variant="ghost">Agendar novo horário</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </main>
    );
  }

  const inicio = booking.schedulingDate;
  const fim = new Date(inicio.getTime() + booking.class.duration * 60 * 1000);
  const studio = await prisma.studioInfo.findFirst();
  const whatsappTexto = encodeURIComponent(
    `Olá! Confirmei minha aula de ${booking.class.name} no Estúdio Lumière para ${formatarData(inicio)} às ${formatarHora(inicio)}. Código: ${booking.confirmationCode}.`
  );
  const whatsappNumero = (studio?.phone ?? "").replace(/\D/g, "");

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <Reveal variant="up">
        <div className="mb-10 flex flex-col items-start gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Reserva confirmada
          </span>
          <h1 className="font-display text-4xl leading-tight text-fg md:text-5xl">
            Tudo certo, seu horário está guardado
          </h1>
          <p className="max-w-2xl text-fg-muted">
            Enviamos o comprovante para o seu e-mail. Chegue com 10 minutos de antecedência para alongar
            com calma antes da aula.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <Reveal variant="left" delay={80}>
          <Card className="h-full">
            <CardBody className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-fg-muted">Aula</p>
                  <CardTitle className="mt-1 font-display text-2xl text-fg">{booking.class.name}</CardTitle>
                  <p className="mt-1 text-sm text-fg-muted">
                    {booking.class.type} · nível {booking.class.level}
                  </p>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                  {booking.status}
                </span>
              </div>

              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-5 w-5 text-brand" aria-hidden />
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-fg-muted">Data</dt>
                    <dd className="text-sm text-fg">{formatarData(inicio)}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-brand" aria-hidden />
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-fg-muted">Horário</dt>
                    <dd className="text-sm text-fg">
                      {formatarHora(inicio)} às {formatarHora(fim)} ({booking.class.duration} min)
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-brand" aria-hidden />
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-fg-muted">Onde</dt>
                    <dd className="text-sm text-fg">{studio?.address ?? "Estúdio Lumière"}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-fg-muted">Código de confirmação</dt>
                  <dd className="mt-1 font-mono text-lg tracking-widest text-fg">{booking.confirmationCode}</dd>
                </div>
              </dl>

              {booking.observations ? (
                <div className="rounded-lg border border-border p-4">
                  <p className="text-xs uppercase tracking-widest text-fg-muted">Suas observações</p>
                  <p className="mt-1 text-sm text-fg">{booking.observations}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3 pt-2">
                <a href={`/api/agendamento/${booking.id}/ics`}>
                  <Button variant="secondary" size="sm">
                    <Download className="mr-2 h-4 w-4" aria-hidden />
                    Adicionar à agenda
                  </Button>
                </a>
                {whatsappNumero ? (
                  <a
                    href={`https://wa.me/${whatsappNumero}?text=${whatsappTexto}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="mr-2 h-4 w-4" aria-hidden />
                      Falar no WhatsApp
                    </Button>
                  </a>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Reveal>

        <Reveal variant="right" delay={160}>
          <div className="flex h-full flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-border">
              <img
                src={ASSETS.photos[0]}
                alt="Sala de prática do Estúdio Lumière com luz natural"
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <p className="font-display text-lg text-fg">Antes de vir</p>
                <ul className="mt-3 space-y-2 text-sm text-fg-muted">
                  <li>Use roupa confortável e meias antiderrapantes.</li>
                  <li>Traga sua garrafa de água.</li>
                  <li>Remarque ou cancele pelo app até 4 horas antes.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-brand p-6 text-brand-fg">
              <p className="font-display text-xl">Próximo passo</p>
              <p className="mt-2 text-sm opacity-90">
                Acompanhe seus horários, remarque e veja seu progresso na sua área.
              </p>
              <Link href="/meus-agendamentos" className="mt-4 inline-flex">
                <Button variant="secondary" size="sm">
                  Meus agendamentos
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal variant="up" delay={240}>
        <p className="mt-10 text-center text-sm text-fg-muted">
          Precisa de outro horário?{" "}
          <Link href="/agendamento" className="text-brand underline-offset-4 hover:underline">
            Agendar novamente
          </Link>
          .
        </p>
      </Reveal>
    </main>
  );
}
