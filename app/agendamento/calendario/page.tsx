import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Calendário de Disponibilidade | Estúdio Lumière",
  description: "Visualize e gerencie os horários e vagas disponíveis para aulas de pilates e yoga com serenidade."
};

export default async function CalendarioDisponibilidadePage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/agendamento/calendario");
  }

  const classesList = await prisma.class.findMany({
    include: {
      bookings: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  const workouts = await prisma.workout.findMany({
    where: { active: true }
  });

  return (
    <div className="min-h-screen bg-bg text-fg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <Reveal variant="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand font-semibold">Agenda do Estúdio</span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-fg mt-1">Calendário de Disponibilidade</h1>
              <p className="text-fg-muted mt-2 max-w-2xl">
                Consulte em tempo real os horários disponíveis, vagas restantes e turmas agendadas para manter sua prática em harmonia.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/agendamento">
                <Button variant="secondary" size="md">Novo Agendamento</Button>
              </Link>
              <Link href="/meus-agendamentos">
                <Button variant="primary" size="md">Minhas Aulas</Button>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Reveal variant="up" delay={100}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">Turmas e Aulas Cadastradas</h2>
                <span className="text-xs bg-brand/10 text-brand px-3 py-1 rounded-full font-medium">
                  {classesList.length} turmas ativas
                </span>
              </div>
            </Reveal>

            {classesList.length === 0 ? (
              <Card className="p-12 text-center bg-surface border border-border">
                <p className="text-fg-muted">Nenhuma turma cadastrada no momento.</p>
                <div className="mt-4">
                  <Link href="/agendamento">
                    <Button variant="primary" size="sm">Explorar Aulas</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {classesList.map((cls, idx) => {
                  const vagasOcupadas = cls.bookings.length;
                  const vagasRestantes = Math.max(0, cls.capacity - vagasOcupadas);
                  const lotado = vagasRestantes === 0;

                  return (
                    <Reveal key={cls.id} variant="up" delay={120 + idx * 40}>
                      <Card className="p-6 bg-surface border border-border hover:border-brand/40 transition-all duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand">
                                {cls.type}
                              </span>
                              <span className="text-xs text-fg-muted font-medium">
                                Nível: {cls.level}
                              </span>
                            </div>
                            <h3 className="text-lg font-display font-semibold text-fg">{cls.name}</h3>
                            <p className="text-sm text-fg-muted">{cls.description}</p>
                            <div className="flex items-center gap-4 text-xs text-fg-muted pt-2">
                              <span>Duração: {cls.duration} min</span>
                              <span>•</span>
                              <span>Capacidade: {cls.capacity} alunos</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-between gap-3 min-w-[140px]">
                            <div className="text-right">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${lotado ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                {lotado ? 'Turma Lotada' : `${vagasRestantes} vagas livres`}
                              </span>
                            </div>
                            <Link href={`/agendamento?classId=${cls.id}`} className="w-full">
                              <Button 
                                variant={lotado ? "ghost" : "primary"} 
                                size="sm" 
                                className="w-full"
                                disabled={lotado}
                              >
                                {lotado ? 'Indisponível' : 'Agendar'}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Reveal variant="up" delay={200}>
              <Card className="p-6 bg-surface border border-border space-y-4">
                <CardTitle className="font-display text-lg">Modalidades e Práticas</CardTitle>
                <CardBody className="p-0 space-y-3">
                  <p className="text-sm text-fg-muted">
                    Explore os programas de treino integrados ao estúdio para complementar sua jornada de bem-estar.
                  </p>
                  {workouts.length === 0 ? (
                    <p className="text-xs text-fg-muted italic">Nenhum treino especial cadastrado.</p>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {workouts.map((w) => (
                        <div key={w.id} className="p-3 rounded-lg bg-bg border border-border/60">
                          <h4 className="text-sm font-semibold text-fg">{w.name}</h4>
                          <p className="text-xs text-fg-muted line-clamp-2 mt-1">{w.description}</p>
                          <div className="flex items-center justify-between text-xs text-brand mt-2 font-medium">
                            <span>{w.totalDuration} min</span>
                            <span>{w.level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Reveal>

            <Reveal variant="up" delay={250}>
              <Card className="p-6 bg-surface border border-border space-y-3">
                <CardTitle className="font-display text-lg">Informações do Estúdio</CardTitle>
                <div className="text-sm text-fg-muted space-y-2 pt-1">
                  <p><strong className="text-fg">Horário de Funcionamento:</strong><br />Segunda a Sábado: 07:00 - 21:00</p>
                  <p><strong className="text-fg">Política de Cancelamento:</strong><br />Cancelamentos permitidos até 4 horas antes do horário agendado sem ônus.</p>
                  <p><strong className="text-fg">Recomendações:</strong><br />Chegue com 10 minutos de antecedência. Traga sua própria toalha e garrafa de água.</p>
                </div>
              </Card>
            </Reveal>
          </div>

        </div>

      </div>
    </div>
  );
}
