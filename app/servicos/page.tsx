import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardTitle, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { Marquee } from '@/components/motion/marquee';
import { copy } from '@/content/copy';
import ASSETS from '@/lib/assets';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Serviços e preços | Estúdio Lumière',
  description:
    'Conheça as aulas, sessões e pacotes do Estúdio Lumière: pilates solo, pilates em aparelhos, yoga restaurativa e atendimento particular. Duração e preço transparentes.',
  openGraph: {
    title: 'Serviços e preços | Estúdio Lumière',
    description:
      'Aulas de pilates e yoga com duração e preço claros. Escolha o formato que cabe na sua rotina e agende em segundos.',
    images: [ASSETS.hero],
  },
};

type ServiceRow = {
  id: string;
  name: string;
  type: string;
  duration: number;
  level: string;
  description: string;
  capacity: number;
  price: number;
};

const FALLBACK: ServiceRow[] = [
  {
    id: 'pilates-solo',
    name: 'Pilates solo',
    type: 'Pilates',
    duration: 50,
    level: 'Todos os níveis',
    description:
      'Aula em grupo pequeno no solo, com foco em respiração, alinhamento e força profunda. Turmas de até 6 pessoas.',
    capacity: 6,
    price: 120,
  },
  {
    id: 'pilates-aparelhos',
    name: 'Pilates em aparelhos',
    type: 'Pilates',
    duration: 55,
    level: 'Intermediário',
    description:
      'Reformer, cadillac e chair com acompanhamento próximo. Indicado para quem já pratica ou tem liberação do fisioterapeuta.',
    capacity: 4,
    price: 180,
  },
  {
    id: 'yoga-restaurativa',
    name: 'Yoga restaurativa',
    type: 'Yoga',
    duration: 60,
    level: 'Iniciante',
    description:
      'Posturas apoiadas por blocos e bolsters, respiração lenta e relaxamento guiado. Ideal para fim de tarde.',
    capacity: 10,
    price: 90,
  },
  {
    id: 'yoga-vinyasa',
    name: 'Yoga vinyasa',
    type: 'Yoga',
    duration: 60,
    level: 'Todos os níveis',
    description:
      'Sequências fluidas que conectam movimento e respiração. Aquece, alonga e fecha com meditação curta.',
    capacity: 12,
    price: 100,
  },
  {
    id: 'particular',
    name: 'Sessão particular',
    type: 'Particular',
    duration: 60,
    level: 'Personalizado',
    description:
      'Atendimento individual com avaliação postural e plano de exercícios desenhado para o seu objetivo.',
    capacity: 1,
    price: 260,
  },
];

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function groupByType(rows: ServiceRow[]) {
  const map = new Map<string, ServiceRow[]>();
  for (const row of rows) {
    const list = map.get(row.type) ?? [];
    list.push(row);
    map.set(row.type, list);
  }
  return Array.from(map.entries());
}

export default async function ServicosPage() {
  let rows: ServiceRow[] = [];
  try {
    const dbRows = await prisma.class.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    rows = dbRows.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      duration: c.duration,
      level: c.level,
      description: c.description,
      capacity: c.capacity,
      price: 0,
    }));
  } catch {
    rows = [];
  }

  const usingFallback = rows.length === 0;
  const list = usingFallback ? FALLBACK : rows;
  const grouped = groupByType(list);

  return (
    <main className="bg-bg">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={ASSETS.hero}
            alt="Sala de pilates do Estúdio Lumière com luz natural entrando pelas janelas"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-bg/75" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal variant="up">
            <p className="text-sm uppercase tracking-[0.2em] text-brand">
              {ASSETS.name}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-fg md:text-6xl">
              Serviços e preços, sem letra miúda
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted">
              {copy.marketing.subheadline}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/agendamento">
                <Button size="lg">{copy.sales.ctaPrimary}</Button>
              </Link>
              <Link href="/planos">
                <Button size="lg" variant="secondary">
                  Ver planos mensais
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <Marquee>
          <span className="mx-6 text-sm text-fg-muted">Pilates solo</span>
          <span className="mx-6 text-sm text-fg-muted">Pilates em aparelhos</span>
          <span className="mx-6 text-sm text-fg-muted">Yoga restaurativa</span>
          <span className="mx-6 text-sm text-fg-muted">Yoga vinyasa</span>
          <span className="mx-6 text-sm text-fg-muted">Sessão particular</span>
          <span className="mx-6 text-sm text-fg-muted">Avaliação postural</span>
        </Marquee>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        {usingFallback && (
          <Reveal variant="up">
            <div className="mb-10 rounded-lg border border-border bg-surface px-5 py-4 text-sm text-fg-muted">
              Estamos finalizando o cadastro oficial das turmas. Os valores abaixo
              são a referência atual do estúdio e podem ser confirmados no
              agendamento.
            </div>
          </Reveal>
        )}

        {grouped.length === 0 ? (
          <Reveal variant="up">
            <Card className="mx-auto max-w-xl text-center">
              <CardTitle>Nenhum serviço publicado ainda</CardTitle>
              <CardBody>
                <p className="text-fg-muted">
                  Assim que a equipe cadastrar as turmas, elas aparecem aqui com
                  duração e preço. Enquanto isso, fale com a recepção para
                  reservar seu horário.
                </p>
                <div className="mt-6">
                  <Link href="/agendamento">
                    <Button>Falar com a recepção</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Reveal>
        ) : (
          <div className="space-y-16">
            {grouped.map(([type, items], groupIndex) => (
              <div key={type}>
                <Reveal variant="up" delay={groupIndex * 60}>
                  <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                    <h2 className="font-display text-2xl text-fg md:text-3xl">
                      {type}
                    </h2>
                    <span className="text-sm text-fg-muted">
                      {items.length}{' '}
                      {items.length === 1 ? 'opção' : 'opções'}
                    </span>
                  </div>
                </Reveal>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  {items.map((item, i) => (
                    <Reveal key={item.id} variant="up" delay={i * 80}>
                      <Card className="hover-lift h-full">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle>{item.name}</CardTitle>
                          <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                            {item.duration} min
                          </span>
                        </div>
                        <CardBody>
                          <p className="text-fg-muted">{item.description}</p>
                          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <dt className="text-fg-muted">Nível</dt>
                              <dd className="mt-1 text-fg">{item.level}</dd>
                            </div>
                            <div>
                              <dt className="text-fg-muted">Turma</dt>
                              <dd className="mt-1 text-fg">
                                até {item.capacity}{' '}
                                {item.capacity === 1 ? 'pessoa' : 'pessoas'}
                              </dd>
                            </div>
                          </dl>
                          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-fg-muted">
                                A partir de
                              </p>
                              <p className="font-display text-2xl text-fg">
                                {item.price > 0
                                  ? formatBRL(item.price)
                                  : 'consulte'}
                              </p>
                            </div>
                            <Link href={`/agendamento?servico=${item.id}`}>
                              <Button size="sm">Agendar</Button>
                            </Link>
                          </div>
                        </CardBody>
                      </Card>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal variant="up">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl text-fg md:text-4xl">
                  Não sabe por onde começar?
                </h2>
                <p className="mt-4 text-fg-muted">
                  {copy.sales.pricingBlurb}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/primeiros-passos">
                    <Button>{copy.sales.ctaSecondary}</Button>
                  </Link>
                  <Link href="/professores">
                    <Button variant="ghost">Conhecer os professores</Button>
                  </Link>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={ASSETS.photos[0]}
                  alt="Professora orientando aluna durante aula de pilates no Estúdio Lumière"
                  className="img-zoom h-72 w-full object-cover md:h-96"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
