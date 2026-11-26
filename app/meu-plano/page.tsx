import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardTitle, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Meu Plano | Estúdio Lumière',
  description: 'Veja seu plano ativo, usos restantes no mês e histórico de pagamentos do Estúdio Lumière.',
  openGraph: {
    title: 'Meu Plano | Estúdio Lumière',
    description: 'Gerencie sua assinatura do Estúdio Lumière.',
  },
};

function fmtBRL(v: number | string) {
  const n = typeof v === 'string' ? Number(v) : v;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default async function MeuPlanoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/entrar');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      payments: {
        where: { planId: { not: null } },
        orderBy: { paymentDate: 'desc' },
        take: 6,
        include: { plan: true },
      },
      bookings: {
        where: {
          schedulingDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          status: { in: ['confirmado', 'concluido'] },
        },
      },
    },
  });

  if (!user) redirect('/entrar');

  const activePlan = user.payments.find((p) => p.plan && p.status === 'pago')?.plan ?? null;
  const usosNoMes = user.bookings.length;
  const limite = activePlan?.limitClassesPerMonth ?? 0;
  const restantes = Math.max(limite - usosNoMes, 0);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Reveal variant="up">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-widest text-brand">Assinatura</p>
          <h1 className="mt-2 font-display text-4xl text-fg">Meu plano</h1>
          <p className="mt-2 text-fg-muted">
            Acompanhe seus usos no mês, o histórico de cobranças e as opções de renovação.
          </p>
        </header>
      </Reveal>

      {!activePlan ? (
        <Reveal variant="up" delay={80}>
          <Card>
            <CardBody>
              <CardTitle>Nenhum plano ativo</CardTitle>
              <p className="mt-2 text-fg-muted">
                Escolha um plano para liberar o agendamento de aulas e o acompanhamento de progresso.
              </p>
              <div className="mt-6">
                <Link href="/planos">
                  <Button variant="primary">Ver planos disponíveis</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Reveal>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Reveal variant="up" delay={60}>
            <Card>
              <CardBody>
                <p className="text-xs uppercase tracking-widest text-fg-muted">Plano ativo</p>
                <CardTitle className="mt-2">{activePlan.name}</CardTitle>
                <p className="mt-1 text-sm text-fg-muted">{activePlan.description}</p>
                <p className="mt-4 font-display text-3xl text-brand">{fmtBRL(activePlan.price)}</p>
                <p className="text-xs text-fg-muted">a cada {activePlan.durationMonths} mês(es)</p>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal variant="up" delay={120}>
            <Card>
              <CardBody>
                <p className="text-xs uppercase tracking-widest text-fg-muted">Usos no mês</p>
                <p className="mt-3 font-display text-4xl text-fg">{usosNoMes}</p>
                <p className="text-sm text-fg-muted">de {limite} aulas incluídas</p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-500"
                    style={{ width: `${limite ? Math.min((usosNoMes / limite) * 100, 100) : 0}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-fg-muted">
                  {restantes > 0 ? `${restantes} aula(s) restantes` : 'Limite do mês atingido'}
                </p>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal variant="up" delay={180}>
            <Card>
              <CardBody>
                <p className="text-xs uppercase tracking-widest text-fg-muted">Ações</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link href="/meu-plano/renovar">
                    <Button variant="primary" className="w-full">Renovar ou trocar plano</Button>
                  </Link>
                  <Link href="/meus-agendamentos">
                    <Button variant="secondary" className="w-full">Ver meus agendamentos</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Reveal>
        </div>
      )}

      <Reveal variant="up" delay={240}>
        <section className="mt-12">
          <h2 className="font-display text-2xl text-fg">Histórico de cobranças</h2>
          {user.payments.length === 0 ? (
            <Card className="mt-4">
              <CardBody>
                <p className="text-fg-muted">Nenhuma cobrança registrada ainda.</p>
              </CardBody>
            </Card>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-surface text-left text-fg-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Plano</th>
                    <th className="px-4 py-3 font-medium">Método</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {user.payments.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-surface/60 transition-colors">
                      <td className="px-4 py-3 text-fg">
                        {new Date(p.paymentDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-fg">{p.plan?.name ?? 'Aula avulsa'}</td>
                      <td className="px-4 py-3 text-fg-muted">{p.method}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-fg">{fmtBRL(Number(p.value))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Reveal>
    </main>
  );
}
