import { prisma } from '@/lib/prisma'
import { copy } from '@/content/copy'
import ASSETS from '@/lib/assets'
import { Reveal } from '@/components/motion/reveal'
import { Card, CardTitle, CardBody } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Seleção de Modalidade | Estúdio Lumière',
  description: 'Escolha entre nossas modalidades de Pilates e Yoga para harmonizar corpo e mente.'
}

export default async function ModalidadesPage() {
  const classes = await prisma.class.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="min-h-screen bg-bg text-fg pb-28 pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section da Modalidade */}
        <Reveal variant="up" className="mb-16 text-center">
          <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-medium tracking-wide text-brand mb-4">
            {ASSETS.slogan}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-fg mb-6">
            Seleção de Modalidade
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-fg-muted font-light leading-relaxed">
            {copy.marketing.subheadline}
          </p>
        </Reveal>

        {/* Lista de Classes / Modalidades */}
        {classes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-sm">
            <h3 className="text-xl font-medium text-fg mb-2">Nenhuma modalidade disponível no momento</h3>
            <p className="text-sm text-fg-muted mb-6">Estamos preparando novas práticas com muito carinho para você.</p>
            <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-medium text-brand-fg transition-all hover:opacity-90">
              Voltar à Página Inicial
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((item, index) => (
              <Reveal key={item.id} variant="up" delay={index * 100}>
                <div className="group flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:shadow-md hover-lift">
                  <div className="relative h-56 w-full overflow-hidden bg-surface-muted">
                    <Image
                      src={ASSETS.photos[index % ASSETS.photos.length]}
                      alt={item.name}
                      fill
                      className="object-cover img-zoom transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 rounded-full bg-surface/90 backdrop-blur-md px-3 py-1 text-xs font-medium text-fg shadow-sm">
                      {item.duration} min
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-brand font-semibold">
                        {item.type}
                      </span>
                      <span className="text-xs text-fg-muted">
                        Nível: {item.level}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-normal text-fg mb-3 group-hover:text-brand transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-fg-muted font-light flex-grow mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-fg-muted">
                        Capacidade: {item.capacity} alunos
                      </span>
                      <Link
                        href={`/agendamento?classId=${item.id}`}
                        className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-fg transition-all hover:opacity-90"
                      >
                        Agendar Aula
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Nota ilustrativa exigida pelas diretrizes */}
        <div className="mt-20 rounded-xl border border-border/60 bg-surface/40 p-6 text-center text-xs text-fg-muted">
          As vagas são limitadas para garantir um atendimento acolhedor e personalizado em cada prática. Em caso de dúvidas, fale conosco pelo WhatsApp.
        </div>

      </div>
    </div>
  )
}
