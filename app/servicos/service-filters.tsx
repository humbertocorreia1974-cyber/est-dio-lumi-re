'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const LEVELS = [
  { value: '', label: 'Todos os níveis' },
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
  { value: 'todos', label: 'Todos os níveis (aula)' },
];

export function ServiceFilters({
  categories,
  currentCategory,
  currentLevel,
}: {
  categories: string[];
  currentCategory: string;
  currentLevel: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`/servicos?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="sr-only" htmlFor="categoria">
        Filtrar por categoria
      </label>
      <select
        id="categoria"
        value={currentCategory}
        onChange={(e) => update('categoria', e.target.value)}
        disabled={isPending}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="nivel">
        Filtrar por nível
      </label>
      <select
        id="nivel"
        value={currentLevel}
        onChange={(e) => update('nivel', e.target.value)}
        disabled={isPending}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {LEVELS.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </select>

      {isPending && (
        <span className="text-xs text-fg-muted" aria-live="polite">
          Atualizando...
        </span>
      )}
    </div>
  );
}
