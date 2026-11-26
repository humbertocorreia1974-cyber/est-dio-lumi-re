import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardTitle, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import BookingWizard from './booking-wizard-client';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Agendar horário | Estúdio Lumière',
  description: 'Escolha o serviço, o professor e o horário livre no Estúdio Lumière. Agendamento rápido e sem conflito.',
  openGraph: {
    title: 'Agendar horário | Estúdio Lumière',
    description: 'Escolha o serviço, o professor e o horário livre no Estúdio Lumière.',
  },
};

export default async function AgendarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/entrar?callbackUrl=/agendar');
  }

  const [services, professors] = await Promise.all([
    ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, description: true, duration: true, price: true, type: true },
    }),
    ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        bio: true,
        photoUrl: true,
        specialties: true,
        user: { select: { name: true } },
        services: { select: { serviceId: true } },
      },
    }),
  ]);

  const serviceList = services.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    duration: s.duration,
    price: Number(s.price),
    type: s.type,
  }));

  const professorList = professors.map((p) => ({
    id: p.id,
    name: p.user.name ?? 'Professor(a)',
    bio: p.bio,
    photoUrl: p.photoUrl,
    specialties: p.specialties,
    serviceIds: p.services.map((ps) => ps.serviceId),
  }));

  const hasData = serviceList.length > 0 && professorList.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal variant="up">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-brand">Agendamento</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-fg sm:text-5xl">
            Reserve seu momento de cuidado
          </h1>
          <p className="mt-4 text-base text-fg-muted">
            Escolha o serviço, o professor e o horário que combina com sua rotina. Confirmamos na hora, sem espera.
          </p>
        </div>
      </Reveal>

      {!hasData ? (
        <Reveal variant="up" delay={80}>
          <Card>
            <CardBody>
              <CardTitle>Agenda em preparação</CardTitle>
              <p className="mt-2 text-sm text-fg-muted">
                Ainda não há serviços e professores cadastrados. Fale com a recepção para liberar sua agenda.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/servicos">
                  <Button variant="primary">Ver serviços</Button>
                </Link>
                <Link href="/meus-agendamentos">
                  <Button variant="ghost">Meus agendamentos</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Reveal>
      ) : (
        <Reveal variant="up" delay={80}>
          <BookingWizard services={serviceList} professors={professorList} />
        </Reveal>
      )}
    </main>
  );
}
