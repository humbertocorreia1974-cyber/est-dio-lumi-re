"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardBody } from "@/components/ui/card";

type Servico = {
  id: string;
  name: string;
  type: string;
  duration: number;
  level: string;
  description: string;
  capacity: number;
  price: number;
};

type Profissional = {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
};

type Slot = { hora: string; disponivel: boolean };

const DIAS = 14;

function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function BookingWizard({ servicos }: { servicos: Servico[] }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [servicoId, setServicoId] = useState<string>("");
  const [profId, setProfId] = useState<string>("");
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [data, setData] = useState<string>(isoDate(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [erroSlots, setErroSlots] = useState<string | null>(null);
  const [horaSel, setHoraSel] = useState<string>("");
  const [obs, setObs] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ code: string; when: string } | null>(
    null
  );

  const servico = useMemo(
    () => servicos.find((s) => s.id === servicoId) || null,
    [servicos, servicoId]
  );

  const dias = useMemo(() => {
    const arr: { iso: string; label: string; sub: string }[] = [];
    const hoje = new Date();
    for (let i = 0; i < DIAS; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() + i);
      arr.push({
        iso: isoDate(d),
        label: d.toLocaleDateString("pt-BR", { weekday: "short" }),
        sub: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!servicoId) return;
    let cancel = false;
    (async () => {
      try {
        const r = await fetch(`/api/agendamento/profissionais?classId=${servicoId}`);
        const j = await r.json();
        if (!cancel) setProfissionais(Array.isArray(j.profissionais) ? j.profissionais : []);
      } catch {
        if (!cancel) setProfissionais([]);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [servicoId]);

  useEffect(() => {
    if (step !== 3 || !servicoId || !data) return;
    let cancel = false;
    setLoadingSlots(true);
    setErroSlots(null);
    setHoraSel("");
    (async () => {
      try {
        const qs = new URLSearchParams({
          classId: servicoId,
          data,
          professionalId: profId || "",
        });
        const r = await fetch(`/api/agendamento/slots?${qs.toString()}`);
        if (!r.ok) throw new Error("falha");
        const j = await r.json();
        if (!cancel) setSlots(Array.isArray(j.slots) ? j.slots : []);
      } catch {
        if (!cancel) setErroSlots("Não foi possível carregar os horários.");
      } finally {
        if (!cancel) setLoadingSlots(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [step, servicoId, data, profId]);

  async function confirmar() {
    if (!servico || !horaSel) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      const r = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: servico.id,
          professionalId: profId || null,
          data,
          hora: horaSel,
          observations: obs || null,
        }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErroEnvio(j.error || "Não foi possível confirmar. Tente outro horário.");
        return;
      }
      setSucesso({ code: j.confirmationCode, when: j.when });
      router.refresh();
    } catch {
      setErroEnvio("Falha de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <Card>
        <CardTitle>Reserva confirmada</CardTitle>
        <CardBody>
          <p className="text-fg-muted">
            Seu horário foi reservado. Guarde o código abaixo.
          </p>
          <div className="mt-4 rounded-2xl border border-border bg-bg p-4">
            <p className="text-xs uppercase tracking-widest text-fg-muted">
              Código
            </p>
            <p className="font-display text-2xl text-brand">{sucesso.code}</p>
            <p className="mt-2 text-sm text-fg-muted">{sucesso.when}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => router.push("/meus-agendamentos")}>
              Ver meus agendamentos
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSucesso(null);
                setStep(1);
                setServicoId("");
                setProfId("");
                setHoraSel("");
                setObs("");
              }}
            >
              Agendar outra aula
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap gap-2 text-xs text-fg-muted">
        {[
          { n: 1, t: "Serviço" },
          { n: 2, t: "Profissional" },
          { n: 3, t: "Dia e horário" },
        ].map((s) => (
          <li
            key={s.n}
            className={`rounded-full border px-3 py-1 ${
              step === s.n
                ? "border-brand text-brand"
                : "border-border text-fg-muted"
            }`}
          >
            {s.n}. {s.t}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          {servicos.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setServicoId(s.id);
                setProfId("");
                setStep(2);
              }}
              className="hover-lift rounded-2xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:border-brand"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{s.name}</p>
                  <p className="text-xs uppercase tracking-widest text-fg-muted">
                    {s.type} · {s.level}
                  </p>
                </div>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">
                  {s.duration} min
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-fg-muted">
                {s.description}
              </p>
              <p className="mt-3 text-sm text-fg">
                R$ {s.price.toFixed(2).replace(".", ",")}
              </p>
            </button>
          ))}
        </div>
      )}

      {step === 2 && servico && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-fg-muted">
              {servico.name} · {servico.duration} min
            </p>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              Trocar serviço
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setProfId("");
                setStep(3);
              }}
              className="hover-lift rounded-2xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:border-brand"
            >
              <p className="font-display text-lg">Qualquer profissional</p>
              <p className="mt-1 text-sm text-fg-muted">
                Mostrar todos os horários livres, com quem estiver disponível.
              </p>
            </button>
            {profissionais.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setProfId(p.id);
                  setStep(3);
                }}
                className="hover-lift rounded-2xl border border-border bg-surface p-5 text-left transition-all duration-200 hover:border-brand"
              >
                <p className="font-display text-lg">{p.name}</p>
                <p className="text-xs uppercase tracking-widest text-fg-muted">
                  {p.role}
                </p>
                {p.bio && (
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                    {p.bio}
                  </p>
                )}
              </button>
            ))}
          </div>
          {profissionais.length === 0 && (
            <p className="text-sm text-fg-muted">
              Nenhum profissional cadastrado para esta modalidade ainda. Você
              pode seguir com "Qualquer profissional".
            </p>
          )}
        </div>
      )}

      {step === 3 && servico && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-fg-muted">
              {servico.name} ·{" "}
              {profId
                ? profissionais.find((p) => p.id === profId)?.name
                : "Qualquer profissional"}
            </p>
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              Trocar profissional
            </Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {dias.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => setData(d.iso)}
                className={`min-w-[72px] rounded-2xl border px-3 py-2 text-center transition-all duration-150 ${
                  data === d.iso
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-fg-muted hover:border-brand/50"
                }`}
              >
                <span className="block text-xs uppercase">{d.label}</span>
                <span className="block text-sm">{d.sub}</span>
              </button>
            ))}
          </div>

          {loadingSlots && (
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          )}

          {erroSlots && !loadingSlots && (
            <div className="rounded-2xl border border-border bg-surface p-4 text-sm">
              <p className="text-fg-muted">{erroSlots}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setData((d) => d)}
              >
                Tentar de novo
              </Button>
            </div>
          )}

          {!loadingSlots && !erroSlots && slots.length === 0 && (
            <p className="rounded-2xl border border-border bg-surface p-4 text-sm text-fg-muted">
              Nenhum horário livre neste dia. Escolha outra data.
            </p>
          )}

          {!loadingSlots && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {slots.map((s) => (
                <button
                  key={s.hora}
                  type="button"
                  disabled={!s.disponivel}
                  onClick={() => setHoraSel(s.hora)}
                  className={`rounded-xl border px-2 py-2 text-sm transition-all duration-150 ${
                    horaSel === s.hora
                      ? "border-brand bg-brand text-brand-fg"
                      : s.disponivel
                      ? "border-border text-fg hover:border-brand"
                      : "cursor-not-allowed border-border text-fg-muted/40 line-through"
                  }`}
                >
                  {s.hora}
                </button>
              ))}
            </div>
          )}

          <div>
            <label
              htmlFor="obs"
              className="mb-1 block text-sm text-fg-muted"
            >
              Observações (opcional)
            </label>
            <textarea
              id="obs"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-brand"
              placeholder="Lesão, preferência de aparelho, primeira aula..."
            />
          </div>

          {erroEnvio && (
            <p className="rounded-xl border border-border bg-surface p-3 text-sm text-fg">
              {erroEnvio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={confirmar}
              disabled={!horaSel || enviando}
            >
              {enviando ? "Confirmando..." : "Confirmar reserva"}
            </Button>
            <span className="text-sm text-fg-muted">
              {horaSel
                ? `Horário escolhido: ${horaSel}`
                : "Escolha um horário livre"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
