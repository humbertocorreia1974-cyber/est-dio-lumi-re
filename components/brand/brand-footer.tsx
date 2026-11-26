/* brand-guard */
import Link from 'next/link';

const BP = process.env.NEXT_PUBLIC_SANDBOX_BASE_PATH || '';
const NAV: { href: string; label: string }[] = [{"href":"/","label":"Início"}];
const LEGAL: { href: string; label: string }[] = [{"href":"/privacidade","label":"Privacidade"},{"href":"/termos","label":"Termos de uso"}];

export default function BrandFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BP + '/logo.svg'} alt="Estúdio Lumière" className="h-9 w-auto max-w-[200px] object-contain" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-muted">Plataforma premium de agendamento e gestão para estúdio de pilates e yoga, com tom sereno e acolhedor</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-fg">Navegar</h3>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            {NAV.map((l) => (<li key={l.href}><a href={l.href} className="transition-colors hover:text-fg">{l.label}</a></li>))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-fg">Atendimento</h3>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>Seg a Sáb · 7h às 20h</li>
            
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-fg-muted sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} Estúdio Lumière. Todos os direitos reservados.</span>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {LEGAL.map((l) => (<li key={l.href}><Link href={l.href} className="hover:text-fg">{l.label}</Link></li>))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
