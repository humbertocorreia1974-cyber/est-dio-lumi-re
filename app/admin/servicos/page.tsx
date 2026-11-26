import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import { Reveal } from '@/components/motion/reveal';
import { ServicoForm } from './servico-form';
import { ServicoAcoes } from './servico-acoes';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gerenciar serviços | Estúdio Lumière',
  description: 'Cadastre, edite e desative as modalidades e serviços oferecidos pelo estúdio.',
  openGraph: {
    title: 'Gerenciar serviços | Estúdio Lumière',
    description: 'Painel do dono para gerenciar serviços e modalidades.',
  },
};

function fmtBRL(v: number | string) {
  const n = typeof v === 'string' ? Number(v) : v;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default async function AdminServicosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/entrar');
  if (session.user.role !== 'admin' && session.user.role !== 'dono') redirect('/');

  const servicos = await prisma.class.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Reveal variant="up">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-widest text-brand">Painel do dono</p>
          <h1 className="mt-2 font-display text-4xl text-fg">Serviços e modalidades</h1>
          <p className="mt-2 text-fg-muted">
            Cadastre novas modalidades, ajuste preço e duração, e desative o que não está em uso.
          </p>
        </header>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-3">
        <Reveal variant="up" delay={60}>
          <Card>
            <CardBody>
              <CardTitle>Novo serviço</CardTitle>
              <p className="mt-1 text-sm text-fg-muted">
                Defina nome, tipo, nível, duração e capacidade da turma.
              </p>
              <div className="mt-6">
                <ServicoForm />
              </div>
            </CardBody>
          </Card>
        </Reveal>

        <Reveal variant="up" delay={120} className="lg:col-span-2">
          <section>
            <h2 className="font-display text-2xl text-fg">Serviços cadastrados</h2>
            {servicos.length === 0 ? (
              <Card className="mt-4">
                <CardBody>
                  <p className="text-fg-muted">
                    Nenhum serviço cadastrado ainda. Use o formulário ao lado para criar o primeiro.
                  </p>
                </CardBody>
              </Card>
            ) : (
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface text-left text-fg-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Nome</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Nível</th>
                      <th className="px-4 py-3 font-medium">Duração</th>
                      <th className="px-4 py-3 font-medium">Capacidade</th>
                      <th className="px-4 py-3 font-medium">Agendamentos</th>
                      <th className="px-4 py-3 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicos.map((s) => (
                      <tr key={s.id} className="border-t border-border hover:bg-surface/60 transition-colors">
                        <td className="px-4 py-3 text-fg">{s.name}</td>
                        <td className="px-4 py-3 text-fg-muted">{s.type}</td>
                        <td className="px-4 py-3 text-fg-muted">{s.level}</td>
                        <td className="px-4 py-3 text-fg-muted">{s.duration} min</td>
                        <td className="px-4 py-3 text-fg-muted">{s.capacity}</td>
                        <td className="px-4 py-3 text-fg-muted">{s._count.bookings}</td>
                        <td className="px-4 py-3 text-right">
                          <ServicoAcoes id={s.id} name={s.name} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </main>
  );
}
