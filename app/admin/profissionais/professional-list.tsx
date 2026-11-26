'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Professional = {
  id: string;
  name: string;
  specialty: string;
  bio: string | null;
  photoUrl: string | null;
  active: boolean;
  bookingsCount: number;
};

export function ProfessionalList({ professionals }: { professionals: Professional[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleActive(p: Professional) {
    setBusyId(p.id);
    setError(null);
    try {
      const res = await fetch(`/api/profissionais/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !p.active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Falha ao atualizar');
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? 'Não foi possível atualizar');
    } finally {
      setBusyId(null);
    }
  }

  if (professionals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-center">
        <p className="font-display text-xl text-fg">Nenhum profissional cadastrado ainda</p>
        <p className="mt-2 text-sm text-fg-muted">
          Use o formulário ao lado para adicionar a primeira pessoa da equipe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {professionals.map((p) => (
          <li key={p.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {p.photoUrl ? (
                <img
                  src={p.photoUrl}
                  alt={`Foto de ${p.name}`}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 font-display text-lg text-brand">
                  {p.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-display text-lg text-fg">{p.name}</p>
                <p className="text-sm text-fg-muted">{p.specialty}</p>
                <p className="mt-1 text-xs text-fg-muted">
                  {p.bookingsCount} agendamento{p.bookingsCount === 1 ? '' : 's'} vinculado
                  {p.bookingsCount === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={
                  p.active
                    ? 'rounded-full bg-brand/10 px-3 py-1 text-xs text-brand'
                    : 'rounded-full bg-fg-muted/10 px-3 py-1 text-xs text-fg-muted'
                }
              >
                {p.active ? 'Ativo' : 'Inativo'}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleActive(p)}
                disabled={busyId === p.id}
              >
                {busyId === p.id ? 'Atualizando...' : p.active ? 'Desativar' : 'Reativar'}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
