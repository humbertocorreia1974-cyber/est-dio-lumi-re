import { prisma } from '@/lib/prisma'
import { Reveal } from '@/components/motion/reveal'
import Image from 'next/image'
import ASSETS from '@/lib/assets'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Galeria — Estúdio Lumière',
  description: 'Conheça nossos espaços de pilates e yoga projetados para proporcionar paz, harmonia e bem-estar.',
  openGraph: {
    title: 'Galeria — Estúdio Lumière',
    description: 'Conheça nossos espaços de pilates e yoga projetados para proporcionar paz, harmonia e bem-estar.',
    images: [ASSETS.hero],
  },
}

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { uploadDate: 'desc' }
  }).catch(() => [])

  return (
    <div className="min-h-screen bg-bg text-fg pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Reveal variant="up" delay={0}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand font-semibold mb-3 block">Nossos Ambientes</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-fg mb-6">
            Espaços criados para a sua <span className="text-brand">serenidade</span>
          </h1>
          <p className="text-fg-muted text-lg leading-relaxed">
            Cada detalhe do Estúdio Lumière foi pensado para acolher sua prática de pilates e yoga com iluminação natural, conforto e tranquilidade.
          </p>
        </div>
      </Reveal>

      {images.length === 0 ? (
        <div className="text-center py-20 bg-surface/40 border border-border rounded-2xl max-w-xl mx-auto p-8">
          <p className="text-fg-muted mb-6">Nenhuma imagem cadastrada no momento. Confira nossos registros principais:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ASSETS.photos.map((photo, i) => (
              <div key={i} className="relative h-48 rounded-xl overflow-hidden img-zoom border border-border">
                <Image src={photo} alt={`Estúdio Lumière foto ${i+1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img, idx) => (
            <Reveal key={img.id} variant="up" delay={idx * 80}>
              <div className="group bg-surface rounded-2xl overflow-hidden border border-border hover-lift shadow-sm flex flex-col h-full">
                <div className="relative h-64 w-full overflow-hidden img-zoom bg-surface/50">
                  <Image 
                    src={img.url} 
                    alt={img.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-display font-semibold text-xl text-fg mb-2">{img.title}</h3>
                  <p className="text-fg-muted text-sm leading-relaxed flex-grow">{img.description}</p>
                  <span className="text-xs text-brand font-medium mt-4 pt-3 border-t border-border/50 block">Estúdio Lumière</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <Reveal variant="up" delay={200}>
        <div className="mt-20 p-10 bg-surface/70 border border-border rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand/5 pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-fg mb-4">Venha conhecer pessoalmente</h2>
          <p className="text-fg-muted max-w-xl mx-auto mb-8 text-base">
            Agende uma visita guiada ou experimente sua primeira aula em nossos espaços de bem-estar.
          </p>
          <a 
            href="/agendamento" 
            className="inline-flex items-center justify-center rounded-full bg-brand text-brand-fg px-8 py-3.5 font-medium hover-lift transition-all shadow-sm"
          >
            Agendar aula experimental
          </a>
        </div>
      </Reveal>
    </div>
  )
}