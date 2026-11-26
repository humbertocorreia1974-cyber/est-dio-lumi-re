"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const ITEMS = [
  "Criei minha conta e aceitei os termos",
  "Completei meu perfil com telefone",
  "Escolhi um plano ativo",
  "Agendei minha primeira aula",
  "Fiz meu primeiro check-in",
  "Registrei minhas medidas iniciais",
];

const STORAGE_KEY = "lumiere:onboarding:checklist";

export function ChecklistClient() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // ignora storage corrompido
    }
    setReady(true);
  }, []);

  function toggle(item: string) {
    setDone((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignora quota
      }
      return next;
    });
  }

  const total = ITEMS.length;
  const completed = ITEMS.filter((i) => done[i]).length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-fg-muted">
          {completed} de {total} concluídos
        </p>
        <p className="text-sm font-medium text-brand">{pct}%</p>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-6 space-y-2">
        {ITEMS.map((item) => {
          const checked = !!done[item];
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                disabled={!ready}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-surface disabled:opacity-60"
              >
                <span
                  className={
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border " +
                    (checked
                      ? "border-brand bg-brand text-brand-fg"
                      : "border-border bg-transparent text-transparent")
                  }
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span
                  className={
                    checked ? "text-fg-muted line-through" : "text-fg"
                  }
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
