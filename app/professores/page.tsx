import { prisma } from '@/lib/prisma';
import ASSETS from '@/lib/assets';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/motion/reveal';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Professores | Estúdio Lumière',
  description: 'Conheça nossa equipe de instrutores especializados em pilates e yoga.',
  openGraph: {
    title: 'Professores | Estúdio Lumière',
    description: 'Conheça nossa equipe de instrutores especializados em pilates e yoga.',
    images: [ASSETS.hero]
  }
};

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: { specialty?: string };
}) {
  const specialtyFilter = searchParams.specialty;

  const teachers = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({
    where: {
      active: true,
      ...(specialtyFilter ? { specialty: { contains: specialtyFilter, mode: 'insensitive' } } : {}),
    },
    include: {
      user: true,
      schedules: {
        where: { active: true },
      },
    },
  });

  const specialtiesRaw = await ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({
    select: { specialty: true },
    distinct: ['specialty'],
  });
  const specialties = specialtiesRaw.map((s) => s.specialty);

  return (
    <div className="min-h-screen bg-bg text-fg py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header da Página */}
        <Reveal variant="up" delay={0}>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-brand font-semibold px-3 py-1 rounded-full bg-brand/10">
              Corpo e Mente
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-fg tracking-tight">
              Nossos Professores
            </h1>
            <p className="text-fg-muted text-base md:text-lg">
              Profissionais dedicados a guiar sua jornada de autoconhecimento, postura e respiração com total atenção e carinho.
            </p>
          </div>
        </Reveal>

        {/* Filtros de Especialidade */}
        <Reveal variant="up" delay={100}>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/professores"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !specialtyFilter
                  ? 'bg-brand text-white shadow-md'
                  : 'bg-surface border border-border text-fg-muted hover:text-fg hover:border-brand/40'
              }`}
            >
              Todos
            </Link>
            {specialties.map((spec) => (
              <Link
                key={spec}
                href={`/professores?specialty=${encodeURIComponent(spec)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  specialtyFilter === spec
                    ? 'bg-brand text-white shadow-md'
                    : 'bg-surface border border-border text-fg-muted hover:text-fg hover:border-brand/40'
                }`}
              >
                {spec}
              </Link>
            ))}
          </div>
        </Reveal>

        {/* Grid de Professores */}
        {teachers.length === 0 ? (
          <Reveal variant="up" delay={200}>
            <Card className="text-center py-16 px-6 bg-surface border border-border rounded-2xl space-y-4">
              <p className="text-lg font-medium text-fg">Nenhum professor encontrado com esta especialidade.</p>
              <p className="text-sm text-fg-muted">Tente selecionar outra categoria ou volte para ver todos os instrutores.</p>
              <Link
                href="/professores"
                className="inline-block mt-4 px-6 py-2.5 rounded-full bg-brand text-white text-sm font-medium hover-lift transition-all"
              >
                Ver todos os professores
              </Link>
            </Card>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <Reveal key={teacher.id} variant="up" delay={150 + index * 60}>
                <div className="group h-full bg-surface border border-border rounded-2xl overflow-hidden hover-lift flex flex-col justify-between transition-all duration-300 shadow-sm hover:border-brand/40">
                  <div>
                    <div className="relative h-64 w-full overflow-hidden bg-surface-muted">
                      <img
                        src={teacher.avatarUrl || ASSETS.photos[index % ASSETS.photos.length]}
                        alt={teacher.user.name || 'Professor'}
                        className="w-full h-full object-cover img-zoom transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-bg/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-brand border border-border/50">
                        {teacher.specialty}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-display font-semibold text-fg">
                        {teacher.user.name || 'Instrutor Lumière'}
                      </h3>
                      <p className="text-sm text-fg-muted leading-relaxed line-clamp-3">
                        {teacher.bio}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-4 border-t border-border/40 mt-4">
                    <div className="text-xs text-fg-muted pt-4">
                      <span className="font-semibold text-fg">Horários regulares:</span>{' '}
                      {teacher.schedules.length > 0
                        ? `${teacher.schedules.length} horários cadastrados`
                        : 'Consulte a agenda'}
                    </div>
                    <Link
                      href={`/agendamento?teacherId=${teacher.id}`}
                      className="w-full block text-center py-2.5 px-4 rounded-xl bg-brand/10 hover:bg-brand text-brand hover:text-white text-sm font-medium transition-all duration-200"
                    >
                      Agendar com {teacher.user.name?.split(' ')[0] || 'Professor'}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
