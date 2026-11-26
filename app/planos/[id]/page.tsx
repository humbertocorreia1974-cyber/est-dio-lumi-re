import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/motion/reveal';
import ASSETS from '@/lib/assets';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const plan = await prisma.plan.findUnique({
    where: { id: params.id },
  });

  if (!plan) {
    return {
      title: 'Plano não encontrado | Estúdio Lumière',
    };
  }

  return {
    title: `${plan.name} | Estúdio Lumière`,
    description: plan.description,
  };
}

export default async function PlanDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  const plan = await prisma.plan.findUnique({
    where: { id: params.id },
  });

  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg text-fg pb-28 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Reveal variant="up" delay={0}>
          <div className="mb-8">
            <Link href="/planos" className="text-sm text-brand hover:underline mb-4 inline-block">
              &larr; Voltar para todos os planos
            </Link>
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-lg mb-8">
              <img
                src={ASSETS.photos[0] || ASSETS.hero}
                alt={plan.name}
                className="w-full h-full object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/40 to-transparent flex items-end p-6 sm:p-10">
                <div>
                  <span className="rounded-full bg-brand/20 px-3 py-1 text-xs font-semibold text-brand backdrop-blur-sm border border-brand/30">
                    {plan.type}
                  </span>
                  <h1 className="text-3xl sm:text-5xl font-serif font-bold text-fg mt-2">
                    {plan.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Reveal variant="up" delay={100}>
              <Card className="p-6 sm:p-8 bg-surface/70 backdrop-blur-sm border border-border rounded-2xl">
                <h2 className="text-xl font-serif font-bold mb-4 text-fg">Visão geral do plano</h2>
                <p className="text-fg-muted leading-relaxed text-lg mb-6">
                  {plan.description}
                </p>
                <div className="border-t border-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-fg-muted uppercase tracking-wider block">Duração do ciclo</span>
                    <span className="text-lg font-medium text-fg">{plan.durationMonths} {plan.durationMonths === 1 ? 'Mês' : 'Meses'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-fg-muted uppercase tracking-wider block">Limite de aulas</span>
                    <span className="text-lg font-medium text-fg">
                      {plan.limitClassesPerMonth === 999 ? 'Acesso Ilimitado' : `${plan.limitClassesPerMonth} aulas por mês`}
                    </span>
                  </div>
                </div>
              </Card>
            </Reveal>

            <Reveal variant="up" delay={200}>
              <Card className="p-6 sm:p-8 bg-surface/70 backdrop-blur-sm border border-border rounded-2xl">
                <h2 className="text-xl font-serif font-bold mb-4 text-fg">O que está incluído</h2>
                <ul className="space-y-3 text-fg-muted">
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Acesso completo às salas de pilates e yoga com equipamentos de ponta.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Agendamento prioritário na plataforma digital.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Toalhas aromáticas e tapetes inclusos em todas as sessões.
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-brand" />
                    Acompanhamento de progresso e avaliações físicas periódicas.
                  </li>
                </ul>
              </Card>
            </Reveal>
          </div>

          <div>
            <Reveal variant="up" delay={300}>
              <Card className="p-6 sm:p-8 bg-surface border border-border rounded-2xl sticky top-24 shadow-xl">
                <div className="text-center pb-6 border-b border-border">
                  <span className="text-xs text-fg-muted uppercase tracking-wider block mb-2">Investimento</span>
                  <div className="text-4xl font-serif font-bold text-fg">
                    R$ {Number(plan.price).toFixed(2)}
                  </div>
                  <span className="text-sm text-fg-muted">cobrado a cada {plan.durationMonths} {plan.durationMonths === 1 ? 'mês' : 'meses'}</span>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-muted">Status</span>
                    <span className="font-medium text-brand">{plan.active ? 'Disponível' : 'Indisponível'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-muted">Renovação</span>
                    <span className="font-medium text-fg">Automática</span>
                  </div>
                </div>

                {session ? (
                  <form action="/api/stripe/checkout" method="POST">
                    <input type="hidden" name="planId" value={plan.id} />
                    <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                      Assinar agora
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login">
                      <Button variant="primary" size="lg" className="w-full justify-center">
                        Entrar para assinar
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-fg-muted">
                      Você precisa estar conectado para contratar um plano.
                    </p>
                  </div>
                )}
              </Card>
            </Reveal>
          </div>
        </div>

      </div>
    </div>
  );
}
