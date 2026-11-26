"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BookingActions({
  bookingId,
  podeCancelar,
  podeRemarcar,
  dataAtual,
}: {
  bookingId: string;
  podeCancelar: boolean;
  podeRemarcar: boolean;
  dataAtual: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [novaData, setNovaData] = useState(dataAtual.slice(0, 16));

  async function acao(action: string, payload: Record<string, unknown> = {}) {
    setErro(null);
    setSucesso(null);
    setLoading(action);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Não foi possível concluir a ação. Tente novamente.");
        return;
      }
      setSucesso(
        action === "cancel"
          ? "Agendamento cancelado."
          : action === "reschedule"
          ? "Agendamento remarcado com sucesso."
          : "Observações atualizadas."
      );
      router.refresh();
    } catch {
      setErro("Falha de conexão. Verifique sua internet e tente de novo.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {podeRemarcar && (
        <div>
          <label htmlFor="nova-data" className="mb-1 block text-sm text-fg">
            Remarcar para
          </label>
          <Input
            id="nova-data"
            type="datetime-local"
            value={novaData}
            onChange={(e) => setNovaData(e.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-2 w-full"
            disabled={loading === "reschedule"}
            onClick={() => acao("reschedule", { schedulingDate: new Date(novaData).toISOString() })}
          >
            {loading === "reschedule" ? "Remarcando..." : "Confirmar novo horário"}
          </Button>
        </div>
      )}

      {podeCancelar && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-red-600 hover:bg-red-500/10"
          disabled={loading === "cancel"}
          onClick={() => {
            if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
              acao("cancel");
            }
          }}
        >
          {loading === "cancel" ? "Cancelando..." : "Cancelar agendamento"}
        </Button>
      )}

      {erro && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600">
          {erro}
          <button
            onClick={() => setErro(null)}
            className="ml-2 underline hover:no-underline"
          >
            Fechar
          </button>
        </div>
      )}
      {sucesso && (
        <div className="rounded-lg border border-brand/30 bg-brand/5 p-3 text-sm text-brand">
          {sucesso}
        </div>
      )}
    </div>
  );
}
