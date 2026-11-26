import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';
import ASSETS from '@/lib/assets';
import { Reveal } from '@/components/motion/reveal';
import { CountUp } from '@/components/motion/count-up';
import { Card, CardTitle, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Aulas e Práticas | Estúdio Lumière',
  description: 'Explore nossas modalidades de pilates e yoga, desenvolvidas para trazer equilíbrio e serenidade para o seu dia.'
};

export default async function AulasPage({
  searchParams,
}: {
  searchParams: { type?: string; level?: string };
}) {
  const session = await getServerSession(authOptions);
  
  const typeFilter = searchParams.type;
  const levelFilter = searchParams.level;

  const whereClause: any = {};
  if (typeFilter) whereClause.type = typeFilter;
  if (levelFilter) whereClause.level = levelFilter;

  const classes = await prisma.class.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { bookings: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  const totalClassesCount = await prisma.class.count();

  return (
    <div className="min-h-screen bg-bg text-fg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HERO DA PÁGINA DE AULAS */}
        <Reveal variant="blur" className="relative rounded-3xl overflow-hidden bg-surface border border-border p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 space-y-4">
            <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              Práticas e Modalidades
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-fg tracking-tight">
              Encontre sua <span className="text-brand italic">Serenidade</span> em Movimento
            </h1>
            <p className="text-fg-muted text-lg leading-relaxed max-w-xl">
              Nossas aulas combinam técnicas tradicionais e contemporâneas de pilates e yoga, com foco na respiração, postura e bem estar integral.
            </p>
            <div className="pt-2 flex items-center gap-6">
              <div>
                <p className="text-3xl font-serif font-bold text-brand">
                  <CountUp to={totalClassesCount} />+
                </p>
                <p className="text-xs text-fg-muted uppercase tracking-wider">Aulas Exclusivas</p>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div>
                <p className="text-3xl font-serif font-bold text-brand">100%</p>
                <p className="text-xs text-fg-muted uppercase tracking-wider">Foco no Alinhamento</p>
              </div>
            </div>
          </div>
          <div className="relative w-full md:w-1/2 h-72 md:h-96 rounded-2xl overflow-hidden shadow-md img-zoom">
            <Image 
              src={ASSETS.photos[0] || ASSETS.hero} 
              alt="Prática de Pilates e Yoga no Estúdio Lumière" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        {/* FILTROS */}
        <Reveal variant="up" delay={100}>
          <div className="bg-surface/70 backdrop-blur-sm border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-fg">Filtrar por:</span>
              <div className="flex flex-wrap gap-2">
                <Link href="/aulas">
                  <Button variant={!typeFilter && !levelFilter ? 'primary' : 'ghost'} size="sm">
                    Todas
                  </Button>
                </Link>
                <Link href="/aulas?type=Pilates">
                  <Button variant={typeFilter === 'Pilates' ? 'primary' : 'ghost'} size="sm">
                    Pilates
                  </Button>
                </Link>
                <Link href="/aulas?type=Yoga">
                  <Button variant={typeFilter === 'Yoga' ? 'primary' : 'ghost'} size="sm">
                    Yoga
                  </Button>
                </Link>
              </div>
            </div>

            <form method="GET" className="flex items-center gap-2 w-full md:w-auto">
              {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
              <select 
                name="level" 
                defaultValue={levelFilter || ''}
                className="bg-bg border border-border rounded-lg px-3 py-1.5 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-brand"
               
              >
                <option value="">Todos os Níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Todos os Níveis">Multinível</option>
              </select>
            </form>
          </div>
        </Reveal>

        {/* LISTAGEM DE AULAS */}
        {classes.length === 0 ? (
          <Reveal variant="scale" className="text-center py-20 bg-surface border border-border rounded-3xl p-8">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-2xl font-serif font-bold text-fg">Nenhuma aula encontrada</h3>
              <p className="text-fg-muted text-sm">
                Não encontramos aulas com os filtros selecionados. Tente redefinir os filtros para ver todas as opções disponíveis.
              </p>
              <div className="pt-2">
                <Link href="/aulas">
                  <Button variant="primary" size="md">Ver Todas as Aulas</Button>
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((item, index) => (
              <Reveal key={item.id} variant="up" delay={index * 80}>
                <Card className="bg-surface border-border rounded-2xl overflow-hidden hover-lift flex flex-col h-full shadow-sm">
                  <div className="relative h-48 w-full bg-border/20 img-zoom">
                    <Image 
                      src={ASSETS.photos[(index + 1) % ASSETS.photos.length] || ASSETS.hero} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-bg/90 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold text-brand">
                      {item.type}
                    </div>
                    <div className="absolute top-3 right-3 bg-bg/90 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-fg">
                      {item.level}
                    </div>
                  </div>
                  <CardBody className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-serif font-bold text-fg">
                        {item.name}
                      </CardTitle>
                      <p className="text-fg-muted text-sm line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-fg-muted">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{item.duration} minutos</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Capacidade: {item.capacity} vagas</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/agendamento?classId=${item.id}`} className="block w-full">
                        <Button variant="primary" size="md" className="w-full justify-center">
                          Agendar Aula
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
