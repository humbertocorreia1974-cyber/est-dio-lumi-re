'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ServicoAcoes({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function desativar() {
    if (!confirm(`Desativar o serviço "${name}"? Agendamentos existentes não serão afetados.`)) return;
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch(`/api/admin/servicos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Não foi possível desativar.');
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={desativar}
        disabled={loading}
        className="rounded-md border border-border px-3 py-1 text-xs text-fg-muted transition-colors hover:bg-surface disabled:opacity-50"
      >
        {loading ? '...' : 'Desativar'}
      </button>
      {erro && <span className="text-xs text-red-600">{erro}</span>}
    </div>
  );
}
