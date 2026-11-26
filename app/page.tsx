// jgnext:landing-archetype editorial — página inicial gerada por arquétipo (layout, movimento e ícones próprios).
import Link from 'next/link';
import ASSETS from '@/lib/assets';
import { copy } from '@/content/copy';
import { Reveal, Words, Parallax, Magnetic, Marquee, ScrollBar, Float } from '@/components/landing/fx';
import { SiteHeader } from '@/components/landing/header';
import { Icon, pickIcon } from '@/components/landing/icons';

export const dynamic = 'force-static';

const M: any = (copy as any).marketing || {};
export const metadata = {
  title: M.seoTitle || ASSETS.name,
  description: M.seoDescription || M.subheadline || '',
  openGraph: { title: M.seoTitle || ASSETS.name, description: M.seoDescription || M.subheadline || '', images: [ASSETS.hero] },
};

const NAV = [{"href":"/planos","label":"Planos"},{"href":"/aulas","label":"Aulas"},{"href":"/servicos","label":"Serviços"},{"href":"/agendar","label":"Agendar"},{"href":"/galeria","label":"Galeria"},{"href":"/sobre","label":"Sobre"},{"href":"/primeiros-passos","label":"Como usar"}] as { href: string; label: string }[];
const FOOT = [{"href":"/termos","label":"Termos"},{"href":"/privacidade","label":"Privacidade"}] as { href: string; label: string }[];
const HEAD: string = M.heroHeadline || M.headline || ASSETS.name;
const SUB: string = M.heroSubheadline || M.subheadline || (ASSETS as any).slogan || '';
const BULLETS: string[] = ((M.featureBullets || M.bullets || M.features || []) as string[]).filter((b) => typeof b === 'string' && b.trim()).slice(0, 6);
const STEPS: string[] = (((copy as any).onboarding?.steps || []) as any[]).map((s) => (typeof s === 'string' ? s : s?.title || s?.text || '')).filter(Boolean).slice(0, 5);
const PH: string[] = ((ASSETS as any).photos && (ASSETS as any).photos.length ? (ASSETS as any).photos : [ASSETS.hero]) as string[];
const ph = (i: number) => PH[i % PH.length];

/** título curto de uma função: corta no primeiro conector e limita o tamanho */
const shortTitle = (b: string) => {
  const t = b.split(/ (?:com|quando|para|por|que|e|em|sem|de) /)[0].replace(/[.,;:]+$/, '');
  const s = t.length > 46 ? t.slice(0, 44).trimEnd() + '…' : t;
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const year = new Date().getFullYear();

export default function Home() {
  const badge = ((ASSETS as any).slogan || ASSETS.name) as string;
  return (
    <main data-landing="editorial" className="overflow-x-clip bg-bg text-fg">
      <ScrollBar />
      <SiteHeader name={ASSETS.name} logo={ASSETS.logo} nav={NAV} variant="editorial" />

      {/* HERO assimétrico: texto grande à esquerda, foto em arco à direita */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-10 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-7">
          <Reveal variant="fade"><p className="mb-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-fg-muted"><span className="h-px w-14 bg-fg" />Edição {year}</p></Reveal>
          <Words text={HEAD} delay={150} className="font-display text-[clamp(2.4rem,6vw,5.4rem)] font-bold leading-[1.02] tracking-tight" />
          <Reveal delay={800}><p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted">{SUB}</p></Reveal>
          <Reveal delay={1000}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Magnetic><Link href="/register" className="inline-flex items-center gap-3 bg-fg px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-bg transition hover:bg-brand hover:text-brand-fg">Começar <span aria-hidden="true">→</span></Link></Magnetic>
              <Link href="/login" className="border-b-2 border-fg pb-1 text-sm font-semibold uppercase tracking-[0.14em] transition hover:border-brand hover:text-brand">Entrar</Link>
            </div>
          </Reveal>
        </div>
        <div className="relative lg:col-span-5">
          <Reveal variant="mask" duration={1300}>
            <Parallax src={ph(0)} alt={ASSETS.name} speed={0.1} className="aspect-[3/4] w-full rounded-t-[999px] border border-fg/15" />
          </Reveal>
          <Float className="absolute -left-4 bottom-10 hidden w-40 sm:block" amp={12} dur={7}>
            <div className="overflow-hidden rounded-2xl border-4 border-bg shadow-2xl">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={ph(1)} alt="" loading="lazy" className="aspect-square w-full object-cover" /></div>
          </Float>
          <Float className="absolute -right-3 top-8 hidden sm:block" amp={9} dur={5.5} delay={0.6}>
            <div className="grid h-32 w-32 place-items-center rounded-full bg-brand text-brand-fg shadow-2xl">
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" style={{ animation: 'jgx-spin 18s linear infinite' }} aria-hidden="true">
                <defs><path id="jgx-circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
                <text fontSize="10" fontWeight="700" letterSpacing="3" fill="currentColor"><textPath href="#jgx-circ">{badge.toUpperCase().slice(0, 34)} • {ASSETS.name.toUpperCase().slice(0, 14)} •</textPath></text>
              </svg>
              <Icon name={pickIcon(BULLETS[0] || badge, 0)} size={34} />
              <style>{'@keyframes jgx-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){svg[style*="jgx-spin"]{animation:none!important}}'}</style>
            </div>
          </Float>
        </div>
      </section>

      {BULLETS.length > 0 && (
        <Marquee items={BULLETS.map(shortTitle)} speed={46} className="border-y border-fg py-4 font-display text-2xl italic" />
      )}

      {/* FUNÇÕES em linhas alternadas com numeral gigante */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-10">
        <Reveal><h2 className="font-display max-w-3xl text-[clamp(2rem,4.4vw,3.8rem)] font-bold leading-[1.05] tracking-tight">Em detalhe.</h2></Reveal>
        <div className="mt-16 grid gap-24">
          {BULLETS.slice(0, 4).map((b, i) => (
            <div key={i} className={'grid items-center gap-10 lg:grid-cols-12 ' + (i % 2 ? 'lg:[&>*:first-child]:order-2' : '')}>
              <Reveal variant={i % 2 ? 'right' : 'left'} className="lg:col-span-5">
                <Parallax src={ph(i + 1)} alt="" speed={0.09} className={'aspect-[4/5] w-full ' + (i % 2 ? 'rounded-b-[999px]' : 'rounded-t-[999px]') + ' border border-fg/15'} />
              </Reveal>
              <div className="lg:col-span-7">
                <Reveal><span className="font-display block text-[clamp(4.5rem,11vw,9.5rem)] font-bold leading-none text-brand/25">{String(i + 1).padStart(2, '0')}</span></Reveal>
                <Reveal delay={120}><div className="-mt-6 flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full border border-fg/20 text-brand"><Icon name={pickIcon(b, i)} size={26} /></span><h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{shortTitle(b)}</h3></div></Reveal>
                <Reveal delay={220}><p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">{b}</p></Reveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CITAÇÃO em destaque */}
      <section className="bg-fg px-5 py-28 text-bg sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal><p className="font-display text-[clamp(1.7rem,4vw,3.4rem)] font-medium italic leading-[1.15]">“{SUB}”</p></Reveal>
          <Reveal delay={150}><p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] opacity-60">{ASSETS.name}</p></Reveal>
        </div>
      </section>

      {/* PASSOS com linha que se desenha */}
      {STEPS.length > 0 && (
        <section className="mx-auto max-w-4xl px-5 py-28 sm:px-10">
          <Reveal><h2 className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-bold tracking-tight">Como começar.</h2></Reveal>
          <ol className="mt-14 grid gap-0">
            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 110}>
                <li className="grid grid-cols-[auto_1fr] gap-6 border-t border-fg/20 py-8">
                  <span className="font-display w-14 text-4xl font-bold text-brand">{i + 1}</span>
                  <p className="text-lg leading-relaxed">{s}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      {/* ENCERRAMENTO com o nome gigante */}
      <section className="overflow-hidden border-t border-fg px-5 pb-10 pt-24 sm:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <Reveal><Magnetic><Link href="/register" className="inline-flex items-center gap-3 bg-brand px-10 py-5 text-sm font-semibold uppercase tracking-[0.16em] text-brand-fg">Criar minha conta <span aria-hidden="true">→</span></Link></Magnetic></Reveal>
          <Reveal delay={150}><p className="font-display mt-16 select-none whitespace-nowrap text-[clamp(3.5rem,15vw,13rem)] font-bold leading-[0.9] tracking-tighter" style={{ WebkitTextStroke: '2px currentColor', color: 'transparent' }}>{ASSETS.name}</p></Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-fg/20 pt-6 text-sm text-fg-muted">
            <span>© {year} {ASSETS.name}</span>
            <nav className="flex flex-wrap gap-5">{FOOT.map((l) => (<Link key={l.href} href={l.href} className="hover:text-fg">{l.label}</Link>))}</nav>
          </div>
        </div>
      </section>
    </main>
  );
}
