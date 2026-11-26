'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Props = { modo: 'renovar' | 'cancelar'; planId: string };

export function RenovarPlanosClient({ modo, planId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function renovar() {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error ?? 'Não foi possível iniciar o checkout.');
      window.location.href = data.url;
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado.');
      setLoading(false);
    }
  }

  async function cancelar() {
    if (!confirm('Confirmar cancelamento da assinatura? Você mantém o acesso até o fim do período pago.')) return;
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch('/api/meu-plano/cancelar', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Não foi possível cancelar.');
      router.push('/meu-plano');
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado.');
      setLoading(false);
    }
  }

  return (
    <div>
      {modo === 'renovar' ? (
        <Button variant="primary" className="w-full" onClick={renovar} disabled={loading}>
          {loading ? 'Abrindo checkout...' : 'Renovar com este plano'}
        </Button>
      ) : (
        <Button variant="secondary" className="w-full" onClick={cancelar} disabled={loading}>
          {loading ? 'Cancelando...' : 'Cancelar assinatura'}
        </Button>
      )}
      {erro && (
        <p className="mt-3 text-sm text-red-600">
          {erro}{' '}
          <button
            type="button"
            className="underline"
            onClick={() => (modo === 'renovar' ? renovar() : cancelar())}
          >
            Tentar de novo
          </button>
        </p>
      )}
    </div>
  );
}
