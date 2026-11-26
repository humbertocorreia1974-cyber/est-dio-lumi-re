import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardTitle, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { copy } from '@/content/copy';
import ASSETS from '@/lib/assets';

export const metadata: Metadata = {
  title: `Conta criada | ${ASSETS.name}`,
  description:
    'Sua conta no Estúdio Lumière foi criada com sucesso. Agende sua primeira aula de pilates ou yoga.',
  openGraph: {
    title: `Conta criada | ${ASSETS.name}`,
    description: 'Sua conta no Estúdio Lumière foi criada com sucesso.',
    images: [ASSETS.hero],
  },
};

export default function CadastroSucessoPage() {
  return (
    <main className="bg-bg">
      <section className="mx-auto max-w-2xl px-6 py-24 md:py-32">
        <Reveal variant="up">
          <Card className="rounded-[24px]">
            <CardBody className="p-8 text-center md:p-12">
              <div
                aria-hidden
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <CardTitle className="mt-6 font-display text-3xl text-fg">
                {copy.onboarding.welcomeTitle}
              </CardTitle>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">
                Sua conta foi criada. Enviamos um e-mail de boas-vindas com os
                próximos passos. Agora é só escolher sua primeira aula.
              </p>

              <ol className="mt-8 space-y-3 text-left text-sm text-fg-muted">
                {copy.onboarding.steps.slice(0, 3).map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/agendamento">
                  <Button variant="primary" size="lg">
                    Agendar primeira aula
                  </Button>
                </Link>
                <Link href="/entrar">
                  <Button variant="secondary" size="lg">
                    Ir para o login
                  </Button>
                </Link>
              </div>

              <p className="mt-8 text-xs text-fg-muted">
                {ASSETS.slogan}
              </p>
            </CardBody>
          </Card>
        </Reveal>
      </section>
    </main>
  );
}
