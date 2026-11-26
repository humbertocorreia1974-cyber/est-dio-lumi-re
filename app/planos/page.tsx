import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardTitle, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { copy } from '@/content/copy';
import ASSETS from '@/lib/assets';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Planos e Assinaturas | Estúdio Lumière',
  description: 'Conheça nossos planos de pilates e yoga, projetados para o seu bem-estar com serenidade e equilíbrio.',
  openGraph: {
    title: 'Planos e Assinaturas | Estúdio Lumière',
    description: 'Conheça nossos planos de pilates e yoga, projetados para o seu bem-estar com serenidade e equilíbrio.',
    images: [ASSETS.hero]
  }
};

type Plano = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  durationMonths: number;
  limitClassesPerMonth: number;
  type: string;
};

function formatPrice(price: number | string): string {
  const value = typeof price === 'string' ? Number(price) : price;
  if (!Number.isFinite(value)) return '0,00';
  return value.toFixed(2).replace('.', ',');
}

export default async function PlanosPage() {
  const session = await getServerSession(authOptions);
  let planos: Plano[] = [];
  try {
    planos = (await prisma.plan.findMany({
      where: { active: true },
      orderBy: { price: 'asc' }
    })) as unknown as Plano[];
  } catch {
    planos = [];
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Hero interno da página de planos */}
      <section className="relative overflow-hidden py-24 px-6 lg:px-12 bg-surface/50 border-b border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="left">
            <span className="text-xs uppercase tracking-widest text-brand font-semibold px-3 py-1 rounded-full bg-brand/10 inline-block mb-4">
              Investimento em Você
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-fg mb-6">
              {copy.sales.pricingBlurb || "Caminhe rumo ao equilíbrio pleno"}
            </h1>
            <p className="text-lg text-fg-muted mb-8 leading-relaxed">
              {copy.marketing.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#planos-cards">
                <Button variant="primary" size="lg">Escolher Plano</Button>
              </Link>
              <Link href="/sobre">
                <Button variant="ghost" size="lg">Conhecer o Estúdio</Button>
              </Link>
            </div>
          </Reveal>
          <Reveal variant="right" delay={150}>
            <div className="relative h-80 lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl img-zoom">
              <Image 
                src={ASSETS.photos[1] || ASSETS.hero} 
                alt="Ambiente sereno do Estúdio Lumière" 
                fill 
                className="object-cover" 
                priority 
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Listagem de Planos */}
      <section id="planos-cards" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal variant="up">
            <h2 className="text-3xl font-display font-bold mb-4">Planos e Assinaturas</h2>
            <p className="text-fg-muted">
              {copy.sales.pricing || "Aproveite nossos planos mensais de assinatura recorrente para uma gestão tranquila e eficiente do seu estúdio."}
            </p>
          </Reveal>
        </div>

        {planos.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-border rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-fg-muted mb-6">Nenhum plano cadastrado no momento. Entre em contato conosco.</p>
            <Link href="/">
              <Button variant="primary">Voltar ao Início</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planos.map((plano, index) => (
              <Reveal key={plano.id} variant="up" delay={index * 100}>
                <Card className="h-full flex flex-col justify-between p-8 border border-border bg-surface/80 backdrop-blur-sm rounded-2xl hover-lift">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs uppercase tracking-wider font-semibold bg-brand/10 text-brand px-3 py-1 rounded-full">
                        {plano.type}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-display font-bold mb-2 text-fg">
                      {plano.name}
                    </CardTitle>
                    <p className="text-fg-muted text-sm mb-6 leading-relaxed">
                      {plano.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-4xl font-display font-bold text-fg">
                        R$ {formatPrice(plano.price)}
                      </span>
                      <span className="text-fg-muted text-sm ml-2">/ {plano.durationMonths} mês(es)</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-sm text-fg-muted">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                        Até {plano.limitClassesPerMonth} aulas por mês
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                        Acesso completo aos instrutores
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                        Gestão e progresso individual
                      </li>
                    </ul>
                  </div>
                  <div>
                    {session ? (
                      <form action="/api/stripe/checkout" method="POST">
                        <input type="hidden" name="planId" value={plano.id} />
                        <Button type="submit" variant="primary" className="w-full">
                          Assinar Agora
                        </Button>
                      </form>
                    ) : (
                      <Link href="/login" className="block w-full">
                        <Button variant="primary" className="w-full">
                          Entrar para Assinar
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Seção Informativa de Apoio */}
      <section className="py-20 bg-surface/30 border-t border-border px-6 lg:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <Reveal variant="up">
            <h3 className="text-2xl font-display font-bold mb-4">Dúvidas sobre os planos?</h3>
            <p className="text-fg-muted mb-8">
              Nossa equipe está sempre disponível para ajudar você a escolher o melhor caminho para sua jornada de bem-estar.
            </p>
            <Link href="/">
              <Button variant="secondary">Fale com a Recepção</Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}