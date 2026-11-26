import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import ASSETS from "@/lib/assets";
import { Activity, TrendingDown, Award, Calendar, Scale, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Progresso e Medidas | Estúdio Lumière",
  description: "Acompanhe sua evolução corporal, peso, percentual de gordura e histórico de aulas no Estúdio Lumière.",
  openGraph: {
    title: "Progresso e Medidas | Estúdio Lumière",
    description: "Acompanhe sua evolução corporal com serenidade e precisão.",
    images: [ASSETS.hero]
  }
};

export default async function ProgressoPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/progresso");
  }

  const userId = session.user.id;

  const progressRecords = await prisma.progress.findMany({
    where: {
      booking: {
        userId: userId
      }
    },
    include: {
      booking: {
        include: {
          class: true
        }
      }
    },
    orderBy: {
      registerDate: 'desc'
    }
  });

  const bookingsCount = await prisma.booking.count({
    where: { userId: userId }
  });

  const checkInsCount = await prisma.checkIn.count({
    where: {
      booking: {
        userId: userId
      },
      present: true
    }
  });

  const latestProgress = progressRecords[0] || null;
  const initialProgress = progressRecords[progressRecords.length - 1] || null;

  const currentWeight = latestProgress?.weight ? Number(latestProgress.weight) : 0;
  const initialWeight = initialProgress?.weight ? Number(initialProgress.weight) : currentWeight;
  const weightDiff = Number((currentWeight - initialWeight).toFixed(1));

  const currentFat = latestProgress?.fatPercentage ? Number(latestProgress.fatPercentage) : 0;

  return (
    <div className="min-h-screen bg-bg text-fg pb-24">
      {/* Hero da Página */}
      <section className="relative py-20 px-6 bg-surface/40 border-b border-border overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={ASSETS.photos[0]} alt="Estúdio Lumière" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal variant="up">
            <span className="text-xs uppercase tracking-widest text-brand font-semibold mb-3 block">Jornada de Autoconhecimento</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-fg mb-4">Progresso e Medidas</h1>
            <p className="text-fg-muted max-w-2xl text-lg">
              Acompanhe sua evolução com serenidade. Cada passo em nosso estúdio reflete equilíbrio entre corpo e mente.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* Cards de Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Reveal variant="up" delay={0}>
            <Card className="p-6 bg-surface border border-border flex items-center justify-between hover-lift">
              <div>
                <p className="text-sm text-fg-muted">Peso Atual</p>
                <div className="text-3xl font-display font-bold mt-1 text-fg">
                  {currentWeight > 0 ? `${currentWeight} kg` : "N/A"}
                </div>
                <p className="text-xs text-brand mt-1">
                  {weightDiff <= 0 ? `${weightDiff} kg desde o início` : `+${weightDiff} kg`}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                <Scale className="w-6 h-6" />
              </div>
            </Card>
          </Reveal>

          <Reveal variant="up" delay={100}>
            <Card className="p-6 bg-surface border border-border flex items-center justify-between hover-lift">
              <div>
                <p className="text-sm text-fg-muted">Gordura Corporal</p>
                <div className="text-3xl font-display font-bold mt-1 text-fg">
                  {currentFat > 0 ? `${currentFat}%` : "N/A"}
                </div>
                <p className="text-xs text-fg-muted mt-1">Última avaliação</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <TrendingDown className="w-6 h-6" />
              </div>
            </Card>
          </Reveal>

          <Reveal variant="up" delay={200}>
            <Card className="p-6 bg-surface border border-border flex items-center justify-between hover-lift">
              <div>
                <p className="text-sm text-fg-muted">Aulas Realizadas</p>
                <div className="text-3xl font-display font-bold mt-1 text-fg">
                  <CountUp to={checkInsCount} />
                </div>
                <p className="text-xs text-brand mt-1">Presenças confirmadas</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                <Activity className="w-6 h-6" />
              </div>
            </Card>
          </Reveal>

          <Reveal variant="up" delay={300}>
            <Card className="p-6 bg-surface border border-border flex items-center justify-between hover-lift">
              <div>
                <p className="text-sm text-fg-muted">Agendamentos</p>
                <div className="text-3xl font-display font-bold mt-1 text-fg">
                  <CountUp to={bookingsCount} />
                </div>
                <p className="text-xs text-fg-muted mt-1">Total no sistema</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Calendar className="w-6 h-6" />
              </div>
            </Card>
          </Reveal>
        </div>

        {/* Histórico de Registros de Progresso */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold">Histórico Biométrico</h2>
              <Link href="/agendamento">
                <Button variant="primary" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Novo Agendamento
                </Button>
              </Link>
            </div>

            {progressRecords.length === 0 ? (
              <Card className="p-12 text-center bg-surface border border-border">
                <Award className="w-12 h-12 text-brand mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold mb-2">Nenhum registro de progresso ainda</h3>
                <p className="text-fg-muted text-sm max-w-md mx-auto mb-6">
                  Suas avaliações e evoluções cadastradas após suas sessões de Pilates e Yoga aparecerão aqui para acompanhamento contínuo.
                </p>
                <Link href="/agendamento">
                  <Button variant="primary">Agendar Sessão</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {progressRecords.map((prog, idx) => (
                  <Reveal key={prog.id} variant="up" delay={idx * 50}>
                    <Card className="p-6 bg-surface border border-border hover:border-brand/40 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand">
                              {new Date(prog.registerDate).toLocaleDateString('pt-BR')}
                            </span>
                            {prog.level && (
                              <span className="text-xs text-fg-muted">Nível: {prog.level}</span>
                            )}
                          </div>
                          <h4 className="font-semibold text-lg text-fg">
                            {prog.booking?.class?.name || "Sessão de Bem-Estar"}
                          </h4>
                          {prog.observations && (
                            <p className="text-sm text-fg-muted mt-2">{prog.observations}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-border">
                          {prog.weight && (
                            <div className="text-right">
                              <span className="text-xs text-fg-muted block">Peso</span>
                              <span className="text-lg font-bold text-fg">{Number(prog.weight)} kg</span>
                            </div>
                          )}
                          {prog.fatPercentage && (
                            <div className="text-right">
                              <span className="text-xs text-fg-muted block">Gordura</span>
                              <span className="text-lg font-bold text-fg">{Number(prog.fatPercentage)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* Dicas e Filosofia do Estúdio */}
          <div className="space-y-6">
            <Reveal variant="right">
              <Card className="p-6 bg-surface border border-border">
                <h3 className="text-xl font-display font-bold mb-3">Filosofia Lumière</h3>
                <p className="text-sm text-fg-muted leading-relaxed mb-4">
                  O progresso no Pilates e no Yoga não se mede apenas por números na balança, mas pela fluidez dos movimentos, respiração consciente e paz interior conquistada a cada prática.
                </p>
                <div className="p-4 rounded-xl bg-brand/5 border border-brand/20 text-xs text-fg leading-relaxed">
                  "Respire fundo, sinta seu eixo e permita que seu corpo evolua no tempo certo."
                </div>
              </Card>
            </Reveal>

            <Reveal variant="right" delay={100}>
              <Card className="p-6 bg-surface border border-border">
                <h3 className="text-xl font-display font-bold mb-3">Próximos Passos</h3>
                <ul className="space-y-3 text-sm text-fg-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand" />
                    Mantenha a frequência semanal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand" />
                    Hidrate-se antes e após as aulas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand" />
                    Converse com seu instrutor sobre suas metas
                  </li>
                </ul>
              </Card>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}
