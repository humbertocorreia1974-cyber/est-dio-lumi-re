'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type FieldErrors = Partial<
  Record<'name' | 'email' | 'password' | 'confirm' | 'phone' | 'terms', string>
>;

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    terms: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = 'Informe seu nome completo.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Informe um e-mail válido.';
    }
    if (form.password.length < 8) {
      next.password = 'A senha precisa ter ao menos 8 caracteres.';
    }
    if (form.confirm !== form.password) {
      next.confirm = 'As senhas não coincidem.';
    }
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) {
      next.phone = 'Telefone incompleto.';
    }
    if (!form.terms) {
      next.terms = 'É necessário aceitar os Termos e a Política de Privacidade.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.trim() || null,
          termsAccepted: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(
          data?.error ||
            'Não foi possível criar sua conta agora. Tente novamente em instantes.'
        );
        setLoading(false);
        return;
      }
      router.push('/primeiros-passos');
      router.refresh();
    } catch {
      setServerError(
        'Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.'
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-fg">
          Nome completo
        </label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Como podemos te chamar"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fg">
          E-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-fg"
          >
            Senha
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirm"
            className="mb-1.5 block text-sm font-medium text-fg"
          >
            Confirmar senha
          </label>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            value={form.confirm}
            onChange={(e) => update('confirm', e.target.value)}
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm && (
            <p className="mt-1.5 text-sm text-red-600">{errors.confirm}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-fg">
          WhatsApp <span className="text-fg-muted">(opcional)</span>
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(11) 91234-5678"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          aria-invalid={!!errors.phone}
        />
        <p className="mt-1.5 text-xs text-fg-muted">
          Usamos para enviar lembretes das suas aulas.
        </p>
        {errors.phone && (
          <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => update('terms', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border text-brand focus:ring-brand"
            aria-invalid={!!errors.terms}
          />
          <span>
            Li e aceito os{' '}
            <Link
              href="/termos"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              Termos de Uso
            </Link>{' '}
            e a{' '}
            <Link
              href="/privacidade"
              className="font-medium text-brand underline-offset-4 hover:underline"
            >
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <p className="mt-1.5 text-sm text-red-600">{errors.terms}</p>
        )}
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Criando sua conta...' : 'Criar conta'}
      </Button>
    </form>
  );
}
