'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ApiResponse = {
  ok?: boolean;
  role?: string;
  error?: string;
};

export function EntrarForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido para continuar.');
      return;
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = (await res.json()) as ApiResponse;

      if (!res.ok || !data.ok) {
        setError(data.error || 'Não conseguimos validar seus dados. Tente novamente.');
        setLoading(false);
        return;
      }

      const destino = data.role === 'admin' || data.role === 'dono' ? '/admin' : '/meus-agendamentos';
      router.push(destino);
      router.refresh();
    } catch {
      setError('Sem conexão com o servidor. Verifique sua internet e tente de novo.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-fg">
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-fg">
          Senha
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-300/60 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <Button type="submit" variant="primary" size="lg" disabled={loading} className="mt-2 w-full">
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}
