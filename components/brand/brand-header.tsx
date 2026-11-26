'use client';
/* brand-guard */
import Link from 'next/link';
import { useState } from 'react';

const BP = process.env.NEXT_PUBLIC_SANDBOX_BASE_PATH || '';
const NAME = "Estúdio Lumière";
const LINKS: { href: string; label: string }[] = [];

export default function BrandHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={NAME}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BP + '/logo.svg'} alt="" className="h-9 w-auto max-w-[190px] object-contain" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg sm:inline-block">Entrar</Link>
          <Link href="/agendar" className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-bg transition hover:opacity-90 active:scale-[0.98]">Agendar</Link>
          <button type="button" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden">
            <span className="block h-0.5 w-5 bg-fg before:absolute before:block before:h-0.5 before:w-5 before:-translate-y-1.5 before:bg-fg after:absolute after:block after:h-0.5 after:w-5 after:translate-y-1.5 after:bg-fg" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border/60 bg-bg px-4 py-3 md:hidden" aria-label="Menu móvel">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base text-fg-muted hover:bg-surface hover:text-fg">{l.label}</a>
          ))}
          <Link href="/login" className="block rounded-lg px-3 py-3 text-base text-fg-muted hover:bg-surface hover:text-fg">Entrar</Link>
        </nav>
      )}
    </header>
  );
}
