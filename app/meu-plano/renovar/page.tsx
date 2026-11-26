import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardTitle, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { RenovarPlanosClient } from './renovar-planos-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Renovar ou cancelar plano | Estúdio Lumière',
  description: 'Renove, troque ou cancele seu plano do Estúdio Lumière com poucos cliques.',
  openGraph: {
    title: 'Renovar ou cancelar plano | Estúdio Lumière',
    description: 'Gerencie a renovação e o cancelamento do seu plano.',
  },
};

export default async function RenovarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/entrar');

  const [planos, ultimoPagamento] = await Promise.all([
    prisma.plan.findMany({ where: { active: true }, orderBy: { price: 'asc' } }),
    prisma.payment.findFirst({
      where: { planId: { not: null }, status: 'pago', bookingId: null },
      orderBy: { paymentDate: 'desc' },
      include: { plan: true },
    }),
  ]);

  const planoAtual = ultimoPagamento?.plan ?? null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Reveal variant="up">
        <header className="mb-10">
          <Link href="/meu-plano" className="text-sm text-brand hover:underline">
            Voltar para meu plano
          </Link>
          <h1 className="mt-3 font-display text-4xl text-fg">Renovar ou cancelar</h1>
          <p className="mt-2 text-fg-muted">
            Escolha um novo plano para renovar ou cancele a assinatura atual. O cancelamento
            mantém o acesso até o fim do período já pago.
          </p>
        </header>
      </Reveal>

      {planoAtual && (
        <Reveal variant="up" delay={60}>
          <Card className="mb-8">
            <CardBody>
              <p className="text-xs uppercase tracking-widest text-fg-muted">Plano atual</p>
              <CardTitle className="mt-2">{planoAtual.name}</CardTitle>
              <p className="mt-1 text-sm text-fg-muted">{planoAtual.description}</p>
              <div className="mt-4">
                <RenovarPlanosClient modo="cancelar" planId={planoAtual.id} />
              </div>
            </CardBody>
          </Card>
        </Reveal>
      )}

      <Reveal variant="up" delay={120}>
        <h2 className="font-display text-2xl text-fg">Planos disponíveis</h2>
      </Reveal>

      {planos.length === 0 ? (
        <Card className="mt-4">
          <CardBody>
            <p className="text-fg-muted">Nenhum plano disponível no momento. Fale com a recepção.</p>
            <div className="mt-4">
              <Link href="/sobre">
                <Button variant="secondary">Falar com o estúdio</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {planos.map((p, i) => (
            <Reveal key={p.id} variant="up" delay={i * 80}>
              <Card className="hover-lift h-full">
                <CardBody>
                  <CardTitle>{p.name}</CardTitle>
                  <p className="mt-1 text-sm text-fg-muted">{p.description}</p>
                  <p className="mt-4 font-display text-3xl text-brand">
                    {Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {p.limitClassesPerMonth} aulas por mês · {p.durationMonths} mês(es)
                  </p>
                  <div className="mt-6">
                    <RenovarPlanosClient modo="renovar" planId={p.id} />
                  </div>
                </CardBody>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
