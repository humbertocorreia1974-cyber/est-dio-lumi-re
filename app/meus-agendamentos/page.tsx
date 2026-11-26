import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import BookingActionsClient from "./booking-actions-client";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Meus Agendamentos | Estúdio Lumière",
  description: "Acompanhe e gerencie suas aulas de pilates e yoga agendadas no Estúdio Lumière.",
};

export default async function MeusAgendamentosPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login?callbackUrl=/meus-agendamentos");
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { class: true },
    orderBy: { schedulingDate: "desc" },
  });

  return (
    <div className="min-h-screen bg-bg py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Reveal variant="up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand font-semibold">Sua Jornada</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-fg mt-1">Meus Agendamentos</h1>
              <p className="text-fg-muted mt-1 text-sm md:text-base">
                Gerencie seus horários de pilates e yoga com serenidade e flexibilidade.
              </p>
            </div>
            <div>
              <Link href="/agendamento">
                <Button variant="primary" size="md">
                  Agendar Nova Aula
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        {bookings.length === 0 ? (
          <Reveal variant="blur" delay={100}>
            <Card className="text-center py-16 border-border bg-surface/40">
              <CardBody className="space-y-4">
                <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto text-brand">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl font-display text-fg">Nenhum agendamento encontrado</CardTitle>
                <p className="text-fg-muted max-w-md mx-auto text-sm">
                  Você ainda não possui aulas agendadas em nosso estúdio. Explore nossos horários e reserve seu momento de bem-estar.
                </p>
                <div className="pt-2">
                  <Link href="/agendamento">
                    <Button variant="primary" size="md">
                      Fazer Primeiro Agendamento
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Reveal>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const dateObj = new Date(booking.schedulingDate);
              const formattedDate = dateObj.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
              const formattedTime = dateObj.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              const isCancelled = booking.status === "cancelled";

              return (
                <Reveal key={booking.id} variant="up" delay={index * 50}>
                  <Card className={`border border-border bg-surface/70 transition-all ${isCancelled ? "opacity-60 bg-surface/30" : "hover-lift"}`}>
                    <CardBody className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                            isCancelled 
                              ? "bg-red-500/10 text-red-500" 
                              : "bg-brand/10 text-brand"
                          }`}>
                            {isCancelled ? "Cancelado" : "Confirmado"}
                          </span>
                          <span className="text-xs text-fg-muted">Código: {booking.confirmationCode}</span>
                        </div>
                        <h3 className="text-lg font-display font-bold text-fg pt-1">
                          {booking.class.name}
                        </h3>
                        <p className="text-sm text-fg-muted flex items-center gap-2">
                          <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formattedDate} às {formattedTime} ({booking.class.duration} min)
                        </p>
                        {booking.class.instructor && (
                          <p className="text-xs text-fg-muted pt-1">
                            Instrutor(a): <span className="font-medium text-fg">{booking.class.instructor}</span>
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-border">
                        <div className="text-right hidden md:block">
                          <span className="text-xs text-fg-muted block">Valor</span>
                          <span className="text-sm font-semibold text-fg">
                            R$ {Number(booking.price).toFixed(2)}
                          </span>
                        </div>
                        <BookingActionsClient bookingId={booking.id} currentStatus={booking.status} />
                      </div>
                    </CardBody>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
