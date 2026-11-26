import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Reveal } from '@/components/motion/reveal';
import ASSETS from '@/lib/assets';
import NovoAgendamentoClient from './novo-agendamento-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Agendar horário | Estúdio Lumière',
  description:
    'Escolha a modalidade, o professor e o horário livre na agenda real do Estúdio Lumière. Confirmação imediata com código.',
  openGraph: {
    title: 'Agendar horário | Estúdio Lumière',
    description: 'Escolha modalidade, professor e horário livre em poucos passos.',
    images: [ASSETS.hero],
  },
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/entrar?callbackUrl=/agendamento/novo');
  }

  const aulas = await prisma.class.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, type: true, duration: true, level: true, capacity: true, description: true },
  });

  return (
    <main className="bg-bg">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={ASSETS.hero} alt="Sala de pilates com luz natural" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-bg/70" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal variant="up">
            <p className="text-xs uppercase tracking-[0.3em] text-brand">{ASSETS.name}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-fg md:text-6xl">
              Agende seu horário
            </h1>
            <p className="mt-4 max-w-xl text-lg text-fg-muted">
              Três passos: modalidade, professor e horário livre. A agenda respeita duração da aula, intervalo de almoço e turmas já cheias.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {aulas.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface p-10 text-center">
            <h2 className="font-display text-2xl text-fg">Nenhuma aula publicada ainda</h2>
            <p className="mt-2 text-fg-muted">
              Assim que a equipe cadastrar as modalidades, os horários aparecem aqui.
            </p>
            <Link
              href="/modalidades"
              className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-fg hover-lift"
            >
              Ver modalidades
            </Link>
          </div>
        ) : (
          <NovoAgendamentoClient aulas={aulas} />
        )}
      </section>
    </main>
  );
}
