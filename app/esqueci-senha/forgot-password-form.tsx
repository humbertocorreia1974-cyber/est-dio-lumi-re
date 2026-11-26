"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "error";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Informe o e-mail cadastrado para continuar.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          data?.error ??
            "Não foi possível enviar o e-mail agora. Tente novamente em instantes."
        );
      }

      setStatus("success");
      setMessage(
        "Se este e-mail estiver cadastrado, o link de redefinição chegará em poucos minutos. Confira também a caixa de spam."
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar o e-mail agora. Tente novamente."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-5">
        <div
          role="status"
          className="rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm text-fg"
        >
          <p className="font-medium text-brand">E-mail enviado</p>
          <p className="mt-1 text-fg-muted">{message}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className="flex-1">
            <Button variant="primary" size="md" className="w-full">
              Voltar para o login
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setMessage("");
            }}
            className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-fg transition-colors duration-150 hover:bg-surface/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Enviar para outro e-mail
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-fg"
        >
          E-mail cadastrado
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "email-error" : undefined}
          required
        />
        {status === "error" && (
          <p id="email-error" className="mt-1.5 text-sm text-red-600">
            {message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Enviar link de redefinição"}
      </Button>

      <p className="text-center text-xs text-fg-muted">
        Ao continuar, você concorda com os{" "}
        <Link
          href="/termos"
          className="underline underline-offset-2 hover:text-fg"
        >
          Termos de uso
        </Link>{" "}
        e a{" "}
        <Link
          href="/privacidade"
          className="underline underline-offset-2 hover:text-fg"
        >
          Política de privacidade
        </Link>
        .
      </p>
    </form>
  );
}
