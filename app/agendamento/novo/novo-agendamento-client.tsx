'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Aula = {
  id: string;
  name: string;
  type: string;
  duration: number;
  level: string;
  capacity: number;
  description: string;
};

type Slot = { hora: string; disponivel: boolean };

function hojeISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export default function NovoAgendamentoClient({ aulas }: { aulas: Aula[] }) {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [classId, setClassId] = useState<string>('');
  const [data, setData] = useState<string>(hojeISO());
  const [hora, setHora] = useState<string>('');
  const [obs, setObs] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState<{ id: string; code: string } | null>(null);

  const aula = useMemo(() => aulas.find((a) => a.id === classId) ?? null, [aulas, classId]);

  useEffect(() => {
    if (!classId || !data) return;
    let ativo = true;
    setCarregando(true);
    setErro(null);
    setHora('');
    fetch(`/api/agendamentos/slots?classId=${encodeURIComponent(classId)}&date=${encodeURIComponent(data)}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? 'Não foi possível carregar os horários.');
        return json as { slots: Slot[] };
      })
      .then((json) => {
        if (ativo) setSlots(json.slots);
      })
      .catch((e: Error) => {
        if (ativo) setErro(e.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [classId, data]);

  async function confirmar() {
    if (!classId || !data || !hora) return;
    setEnviando(true);
    setErro(null);
    try {
      const r = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, date: data, hora, observations: obs }),
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error ?? 'Não foi possível confirmar.');
      setConfirmado({ id: json.id, code: json.code });
      router.refresh();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (confirmado) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <CardBody className="space-y-4 py-10">
          <p className="text-xs uppercase tracking-[0.3em] text-brand">Confirmado</p>
          <h2 className="font-display text-3xl text-fg">Seu horário está reservado</h2>
          <p className="text-fg-muted">
            {aula?.name} em {new Date(`${data}T${hora}:00`).toLocaleDateString('pt-BR')} às {hora}.
          </p>
          <p className="rounded-full bg-brand/10 px-4 py-2 text-sm text-brand">
            Código: {confirmado.code}
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <Button onClick={() => router.push('/meus-agendamentos')}>Ver meus agendamentos</Button>
            <Button variant="ghost" onClick={() => { setConfirmado(null); setPasso(1); setHora(''); setObs(''); }}>
              Agendar outro
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-fg-muted">
          <span className={passo >= 1 ? 'text-brand' : ''}>1 Modalidade</span>
          <span className="h-px flex-1 bg-border" />
          <span className={passo >= 2 ? 'text-brand' : ''}>2 Professor</span>
          <span className="h-px flex-1 bg-border" />
          <span className={passo >= 3 ? 'text-brand' : ''}>3 Horário</span>
        </div>

        {passo === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {aulas.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => { setClassId(a.id); setPasso(2); }}
                className={`rounded-3xl border p-6 text-left transition-all duration-200 hover-lift ${
                  classId === a.id ? 'border-brand bg-brand/5' : 'border-border bg-surface'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-brand">{a.type}</p>
                <h3 className="mt-2 font-display text-xl text-fg">{a.name}</h3>
                <p className="mt-2 text-sm text-fg-muted">{a.description}</p>
                <p className="mt-4 text-xs text-fg-muted">
                  {a.duration} min · nível {a.level} · até {a.capacity} alunos
                </p>
              </button>
            ))}
          </div>
        )}

        {passo === 2 && aula && (
          <Card>
            <CardBody className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-brand">Modalidade escolhida</p>
              <CardTitle>{aula.name}</CardTitle>
              <p className="text-sm text-fg-muted">
                {aula.duration} minutos por aula. Escolha a data e o horário livre na agenda real do estúdio.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={() => setPasso(3)}>Escolher data e horário</Button>
                <Button variant="ghost" onClick={() => setPasso(1)}>Trocar modalidade</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {passo === 3 && aula && (
          <Card>
            <CardBody className="space-y-5">
              <div>
                <label htmlFor="data" className="text-sm font-medium text-fg">Data</label>
                <Input
                  id="data"
                  type="date"
                  min={hojeISO()}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-fg">Horários livres</p>
                {carregando && (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-10 animate-pulse rounded-full bg-surface" />
                    ))}
                  </div>
                )}
                {!carregando && erro && (
                  <div className="mt-3 rounded-2xl border border-border bg-surface p-4 text-sm text-fg-muted">
                    {erro}
                    <button
                      type="button"
                      onClick={() => setData((d) => d)}
                      className="ml-2 underline text-brand"
                    >
                      Tentar de novo
                    </button>
                  </div>
                )}
                {!carregando && !erro && slots.length === 0 && (
                  <p className="mt-3 text-sm text-fg-muted">
                    Nenhum horário disponível nesse dia. Escolha outra data.
                  </p>
                )}
                {!carregando && !erro && slots.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((s) => (
                      <button
                        key={s.hora}
                        type="button"
                        disabled={!s.disponivel}
                        onClick={() => setHora(s.hora)}
                        className={`rounded-full border px-3 py-2 text-sm transition-all duration-150 ${
                          hora === s.hora
                            ? 'border-brand bg-brand text-brand-fg'
                            : s.disponivel
                              ? 'border-border bg-surface text-fg hover:bg-brand/10'
                              : 'cursor-not-allowed border-border bg-surface text-fg-muted line-through opacity-60'
                        }`}
                      >
                        {s.hora}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="obs" className="text-sm font-medium text-fg">Observações (opcional)</label>
                <textarea
                  id="obs"
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-fg outline-none focus-visible:border-brand"
                  placeholder="Lesão, preferência de aparelho, primeira aula..."
                />
              </div>

              {erro && <p className="text-sm text-red-600">{erro}</p>}

              <div className="flex flex-wrap gap-3">
                <Button onClick={confirmar} disabled={!hora || enviando}>
                  {enviando ? 'Confirmando...' : 'Confirmar agendamento'}
                </Button>
                <Button variant="ghost" onClick={() => setPasso(1)}>Trocar modalidade</Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      <aside className="h-fit rounded-3xl border border-border bg-surface p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brand">Resumo</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">Modalidade</dt>
            <dd className="text-right text-fg">{aula?.name ?? 'A escolher'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">Duração</dt>
            <dd className="text-right text-fg">{aula ? `${aula.duration} min` : 'A escolher'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">Data</dt>
            <dd className="text-right text-fg">
              {data ? new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR') : 'A escolher'}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">Horário</dt>
            <dd className="text-right text-fg">{hora || 'A escolher'}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-fg-muted">
          Cancelamento gratuito até 4 horas antes. O lembrete chega por e-mail no dia anterior.
        </p>
      </aside>
    </div>
  );
}
