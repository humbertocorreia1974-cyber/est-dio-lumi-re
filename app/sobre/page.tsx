import { Metadata } from 'next';
import Image from 'next/image';
import ASSETS from '@/lib/assets';
import { copy } from '@/content/copy';
import { Reveal } from '@/components/motion/reveal';
import { CountUp } from '@/components/motion/count-up';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sobre | Estúdio Lumière',
  description: 'Conheça a nossa filosofia, espaço e os instrutores dedicados ao seu bem-estar através do pilates e do yoga.',
  openGraph: {
    title: 'Sobre | Estúdio Lumière',
    description: 'Conheça a nossa filosofia e o nosso espaço dedicado ao bem-estar e equilíbrio.',
  },
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-bg text-fg pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="left" delay={0}>
            <div className="space-y-6">
              <span className="inline-block text-xs uppercase tracking-widest text-brand font-semibold px-3 py-1 rounded-full bg-brand/10">
                Nossa Essência
              </span>
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight">
                Um santuário dedicado ao movimento consciente
              </h1>
              <p className="text-lg text-fg-muted leading-relaxed">
                Fundado com o propósito de unir a precisão do pilates com a respiração profunda do yoga, o Estúdio Lumière nasceu como um refúgio urbano onde a luz natural e a arquitetura orgânica convidam ao silêncio interior e ao fortalecimento físico.
              </p>
              <div className="flex gap-4 pt-4">
                <a
                  href="/agendamento"
                  className="inline-flex items-center justify-center rounded-xl bg-brand text-white px-6 py-3 font-medium shadow-sm hover:opacity-95 transition-all"
                >
                  Agende sua Visita
                </a>
                <a
                  href="/planos"
                  className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-3 font-medium hover:bg-surface/50 transition-all"
                >
                  Conheça os Planos
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={150}>
            <div className="relative h-[420px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl img-zoom">
              <Image
                src={ASSETS.hero}
                alt="Ambiente sereno do Estúdio Lumière"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface/50 border-y border-border my-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Reveal variant="up" delay={0}>
              <div className="p-6">
                <div className="text-4xl lg:text-5xl font-display font-bold text-brand mb-2">
                  <CountUp to={8} suffix="+" />
                </div>
                <p className="text-sm text-fg-muted font-medium">Anos de Experiência</p>
              </div>
            </Reveal>

            <Reveal variant="up" delay={100}>
              <div className="p-6">
                <div className="text-4xl lg:text-5xl font-display font-bold text-brand mb-2">
                  <CountUp to={1200} suffix="+" />
                </div>
                <p className="text-sm text-fg-muted font-medium">Alunos Atendidos</p>
              </div>
            </Reveal>

            <Reveal variant="up" delay={200}>
              <div className="p-6">
                <div className="text-4xl lg:text-5xl font-display font-bold text-brand mb-2">
                  <CountUp to={15} suffix="" />
                </div>
                <p className="text-sm text-fg-muted font-medium">Instrutores Especializados</p>
              </div>
            </Reveal>

            <Reveal variant="up" delay={300}>
              <div className="p-6">
                <div className="text-4xl lg:text-5xl font-display font-bold text-brand mb-2">
                  <CountUp to={100} suffix="%" />
                </div>
                <p className="text-sm text-fg-muted font-medium">Foco em Bem-Estar</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Reveal variant="up" delay={0}>
            <div className="p-8 rounded-2xl border border-border bg-surface/40 hover:border-brand/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                🌿
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Arquitetura Biofílica</h3>
              <p className="text-fg-muted text-sm leading-relaxed">
                Espaços integrados com elementos naturais, madeira certificada e iluminação planejada para acalmar o sistema nervoso desde o primeiro passo.
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={100}>
            <div className="p-8 rounded-2xl border border-border bg-surface/40 hover:border-brand/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                🧘‍♀️
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Atenção Plena</h3>
              <p className="text-fg-muted text-sm leading-relaxed">
                Turmas reduzidas que permitem um acompanhamento personalizado e profundo, garantindo segurança na postura e conexão com a respiração.
              </p>
            </div>
          </Reveal>

          <Reveal variant="up" delay={200}>
            <div className="p-8 rounded-2xl border border-border bg-surface/40 hover:border-brand/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                ✨
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Equipe Dedicada</h3>
              <p className="text-fg-muted text-sm leading-relaxed">
                Profissionais certificados internacionalmente, em constante atualização nas mais modernas técnicas de reabilitação e condicionamento físico.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand font-semibold">Nosso Espaço</span>
          <h2 className="text-3xl font-display font-bold mt-2">Feito para inspirar tranquilidade</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ASSETS.photos.slice(0, 3).map((photo, index) => (
            <Reveal key={index} variant="scale" delay={index * 100}>
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-md img-zoom">
                <Image
                  src={photo}
                  alt={`Foto do Estúdio Lumière ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}