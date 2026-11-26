'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ServicoForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setOk(false);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get('name') ?? '').trim(),
      type: String(form.get('type') ?? '').trim(),
      level: String(form.get('level') ?? '').trim(),
      duration: Number(form.get('duration') ?? 0),
      capacity: Number(form.get('capacity') ?? 0),
      description: String(form.get('description') ?? '').trim(),
    };
    try {
      const res = await fetch('/api/admin/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Não foi possível salvar.');
      setOk(true);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-fg">Nome</label>
        <Input id="name" name="name" required placeholder="Pilates Solo" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="type" className="mb-1 block text-sm text-fg">Tipo</label>
          <Input id="type" name="type" required placeholder="Pilates" />
        </div>
        <div>
          <label htmlFor="level" className="mb-1 block text-sm text-fg">Nível</label>
          <Input id="level" name="level" required placeholder="Iniciante" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="duration" className="mb-1 block text-sm text-fg">Duração (min)</label>
          <Input id="duration" name="duration" type="number" min={15} step={5} required defaultValue={50} />
        </div>
        <div>
          <label htmlFor="capacity" className="mb-1 block text-sm text-fg">Capacidade</label>
          <Input id="capacity" name="capacity" type="number" min={1} required defaultValue={6} />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm text-fg">Descrição</label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-brand"
          placeholder="Aula em grupo pequeno, com foco em alinhamento e respiração."
        />
      </div>
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Salvando...' : 'Cadastrar serviço'}
      </Button>
      {ok && <p className="text-sm text-brand">Serviço cadastrado com sucesso.</p>}
      {erro && (
        <p className="text-sm text-red-600">
          {erro}{' '}
          <button type="button" className="underline" onClick={() => setErro(null)}>
            Fechar
          </button>
        </p>
      )}
    </form>
  );
}
