import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Reveal } from '@/components/motion/reveal';
import { ProfessionalForm } from './professional-form';
import { ProfessionalList } from './professional-list';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gerenciar profissionais | Estúdio Lumière',
  description: 'Cadastre, edite e desative os profissionais do estúdio.',
  openGraph: {
    title: 'Gerenciar profissionais | Estúdio Lumière',
    description: 'Cadastre, edite e desative os profissionais do estúdio.',
  },
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/entrar');
  if (session.user.role !== 'admin' && session.user.role !== 'dono') redirect('/');

  const professionals = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({
    orderBy: [{ active: 'desc' }, { name: 'asc' }],
    include: { _count: { select: { bookings: true } } },
  });

  const ativos = professionals.filter((p) => p.active).length;
  const inativos = professionals.length - ativos;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal variant="up">
        <header className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Painel do dono</p>
            <h1 className="mt-2 font-display text-4xl text-fg md:text-5xl">Gerenciar profissionais</h1>
            <p className="mt-3 max-w-xl text-fg-muted">
              Cadastre a equipe que atende no estúdio, defina especialidades e mantenha a agenda organizada.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-fg-muted">Ativos</p>
              <p className="font-display text-2xl text-brand">{ativos}</p>
            </div>
            <div>
              <p className="text-fg-muted">Inativos</p>
              <p className="font-display text-2xl text-fg">{inativos}</p>
            </div>
          </div>
        </header>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <Reveal variant="up" delay={80}>
            <h2 className="mb-4 font-display text-2xl text-fg">Equipe cadastrada</h2>
          </Reveal>
          <ProfessionalList
            professionals={professionals.map((p) => ({
              id: p.id,
              name: p.name,
              specialty: p.specialty,
              bio: p.bio,
              photoUrl: p.photoUrl,
              active: p.active,
              bookingsCount: p._count.bookings,
            }))}
          />
        </section>

        <aside>
          <Reveal variant="right" delay={120}>
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-xl text-fg">Novo profissional</h2>
              <p className="mt-1 text-sm text-fg-muted">
                Preencha os dados e envie uma foto para o perfil.
              </p>
              <div className="mt-6">
                <ProfessionalForm />
              </div>
            </div>
          </Reveal>
        </aside>
      </div>
    </main>
  );
}
