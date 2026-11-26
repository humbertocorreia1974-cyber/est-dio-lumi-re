import type { Metadata } from 'next';
import Link from 'next/link';
import ASSETS from '@/lib/assets';
import { copy } from '@/content/copy';
import { Reveal } from '@/components/motion/reveal';
import { Card, CardBody } from '@/components/ui/card';
import { CadastroForm } from './cadastro-form';

export const metadata: Metadata = {
  title: 'Criar conta | Estúdio Lumière',
  description:
    'Crie sua conta no Estúdio Lumière e agende aulas de pilates e yoga com serenidade. Gestão premium para alunos e estúdio.',
  openGraph: {
    title: 'Criar conta | Estúdio Lumière',
    description:
      'Crie sua conta no Estúdio Lumière e agende aulas de pilates e yoga com serenidade.',
    type: 'website',
    images: [ASSETS.hero],
  },
};

export default function CadastroPage() {
  return (
    <main className="bg-bg">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <Reveal variant="left">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
              Comece hoje
            </span>
            <h1 className="mt-6 font-display text-4xl leading-tight text-fg md:text-5xl">
              {copy.marketing.headline}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted">
              {copy.marketing.subheadline}
            </p>
            <ul className="mt-8 space-y-3 text-sm text-fg-muted">
              {copy.marketing.bullets.slice(0, 4).map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 overflow-hidden rounded-2xl border border-border">
              <img
                src={ASSETS.hero}
                alt="Sala de pilates com luz natural no Estúdio Lumière"
                className="img-zoom h-64 w-full object-cover"
              />
            </div>
            <p className="mt-4 text-xs text-fg-muted">{ASSETS.slogan}</p>
          </div>
        </Reveal>

        <Reveal variant="right" delay={120}>
          <Card className="border-border">
            <CardBody className="p-6 md:p-8">
              <h2 className="font-display text-2xl text-fg">Criar sua conta</h2>
              <p className="mt-2 text-sm text-fg-muted">
                Leva menos de um minuto. Você poderá agendar sua primeira aula em seguida.
              </p>
              <div className="mt-6">
                <CadastroForm />
              </div>
              <p className="mt-6 text-center text-sm text-fg-muted">
                Já tem conta?{' '}
                <Link href="/login" className="font-medium text-brand hover:underline">
                  Entrar
                </Link>
              </p>
            </CardBody>
          </Card>
        </Reveal>
      </section>
    </main>
  );
}
