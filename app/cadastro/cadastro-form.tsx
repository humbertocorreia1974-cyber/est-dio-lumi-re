'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirm' | 'terms' | 'form', string>>;

export function CadastroForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (name.trim().length < 2) e.name = 'Informe seu nome completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Informe um e-mail válido.';
    if (password.length < 8) e.password = 'A senha precisa ter ao menos 8 caracteres.';
    if (password !== confirm) e.confirm = 'As senhas não coincidem.';
    if (!terms) e.terms = 'É necessário aceitar os Termos e a Política de Privacidade.';
    return e;
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, phone: phone.trim() || null, termsAccepted: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ form: data?.error || 'Não foi possível criar sua conta. Tente novamente.' });
        setLoading(false);
        return;
      }
      router.push('/login?cadastrado=1');
    } catch {
      setErrors({ form: 'Falha de conexão. Verifique sua internet e tente novamente.' });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-fg">
          Nome completo
        </label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Como podemos te chamar"
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-fg">
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-fg">
          Telefone (opcional)
        </label>
        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(11) 90000-0000"
          autoComplete="tel"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-fg">
            Senha
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-fg">
            Confirmar senha
          </label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repita a senha"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-brand focus-visible:outline-brand"
            aria-invalid={!!errors.terms}
          />
          <span>
            Li e aceito os{' '}
            <Link href="/termos" className="font-medium text-brand hover:underline">
              Termos de uso
            </Link>{' '}
            e a{' '}
            <Link href="/privacidade" className="font-medium text-brand hover:underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {errors.terms && <p className="mt-1 text-xs text-red-600">{errors.terms}</p>}
      </div>

      {errors.form && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  );
}
