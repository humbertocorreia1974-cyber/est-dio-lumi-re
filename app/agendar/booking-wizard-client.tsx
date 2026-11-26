'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardTitle } from '@/components/ui/card';

type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  type: string;
};

type Professor = {
  id: string;
  name: string;
  bio: string | null;
  photoUrl: string | null;
  specialties: string[];
  serviceIds: string[];
};

type Slot = { time: string; iso: string };

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function nextDays(count: number) {
  const out: { iso: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    out.push({
      iso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
    });
  }
  return out;
}

export default function BookingWizard({
  services,
  professors,
}: {
  services: Service[];
  professors: Professor[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [professorId, setProfessorId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(nextDays(1)[0].iso);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ code: string; when: string } | null>(null);

  const days = useMemo(() => nextDays(14), []);
  const service = services.find((s) => s.id === serviceId) ?? null;
  const eligibleProfessors = useMemo(
    () => professors.filter((p) => !serviceId || p.serviceIds.includes(serviceId)),
    [professors, serviceId]
  );
  const professor = professors.find((p) => p.id === professorId) ?? null;

  useEffect(() => {
    if (step !== 3 || !serviceId || !professorId || !date) return;
    let cancel = false;
    setLoadingSlots(true);
    setSlotError(null);
    setSelectedSlot(null);
    const params = new URLSearchParams({ serviceId, professorId, date });
    fetch(`/api/agendamentos/disponibilidade?${params.toString()}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error ?? 'Não foi possível carregar horários.');
        if (!cancel) setSlots(data.slots ?? []);
      })
      .catch((e: Error) => {
        if (!cancel) {
          setSlots([]);
          setSlotError(e.message);
        }
      })
      .finally(() => {
        if (!cancel) setLoadingSlots(false);
      });
    return () => {
      cancel = true;
    };
  }, [step, serviceId, professorId, date]);

  async function confirm() {
    if (!selectedSlot || !serviceId || !professorId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          professorId,
          schedulingDate: selectedSlot.iso,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Não foi possível confirmar.');
      setSuccess({ code: data.confirmationCode, when: data.schedulingDate });
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Erro ao confirmar.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card>
        <CardBody>
          <CardTitle>Agendamento confirmado</CardTitle>
          <p className="mt-2 text-sm text-fg-muted">
            Guarde o código <span className="font-mono text-brand">{success.code}</span>. Você receberá um lembrete antes da aula.
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Quando: {new Date(success.when).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => router.push('/meus-agendamentos')}>
              Ver meus agendamentos
            </Button>
            <Button variant="ghost" onClick={() => router.push('/agendar')}>
              Agendar outra aula
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ol className="flex items-center gap-3 text-xs uppercase tracking-widest text-fg-muted">
        {[1, 2, 3].map((n) => (
          <li key={n} className={step === n ? 'text-brand' : ''}>
            {n}. {n === 1 ? 'Serviço' : n === 2 ? 'Professor' : 'Horário'}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setServiceId(s.id);
                setProfessorId(null);
                setStep(2);
              }}
              className={`hover-lift rounded-2xl border p-5 text-left transition-all duration-200 ${
                serviceId === s.id ? 'border-brand bg-brand/5' : 'border-border bg-surface'
              }`}
            >
              <p className="text-xs uppercase tracking-widest text-brand">{s.type}</p>
              <p className="mt-1 font-display text-xl text-fg">{s.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{s.description}</p>
              <p className="mt-3 text-sm text-fg">
                {s.duration} min · {brl(s.price)}
              </p>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {eligibleProfessors.length === 0 && (
              <Card>
                <CardBody>
                  <p className="text-sm text-fg-muted">
                    Nenhum professor disponível para este serviço. Escolha outro serviço.
                  </p>
                  <Button variant="ghost" className="mt-3" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                </CardBody>
              </Card>
            )}
            {eligibleProfessors.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setProfessorId(p.id);
                  setStep(3);
                }}
                className={`hover-lift flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  professorId === p.id ? 'border-brand bg-brand/5' : 'border-border bg-surface'
                }`}
              >
                <div className="h-14 w-14 overflow-hidden rounded-full bg-brand/10">
                  {p.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-display text-lg text-brand">
                      {p.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-display text-lg text-fg">{p.name}</p>
                  <p className="text-xs text-fg-muted">{p.specialties.join(' · ') || 'Pilates e Yoga'}</p>
                </div>
              </button>
            ))}
          </div>
          <Button variant="ghost" onClick={() => setStep(1)}>
            Voltar
          </Button>
        </div>
      )}

      {step === 3 && service && professor && (
        <div className="space-y-6">
          <Card>
            <CardBody>
              <p className="text-sm text-fg-muted">
                {service.name} com {professor.name} · {service.duration} min · {brl(service.price)}
              </p>
            </CardBody>
          </Card>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d.iso}
                type="button"
                onClick={() => setDate(d.iso)}
                className={`min-w-[72px] rounded-xl border px-3 py-2 text-center transition-all duration-150 ${
                  date === d.iso ? 'border-brand bg-brand text-brand-fg' : 'border-border bg-surface text-fg'
                }`}
              >
                <span className="block text-[10px] uppercase">{d.weekday}</span>
                <span className="block text-sm font-medium">{d.label}</span>
              </button>
            ))}
          </div>

          {loadingSlots && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-surface" />
              ))}
            </div>
          )}

          {!loadingSlots && slotError && (
            <Card>
              <CardBody>
                <p className="text-sm text-fg-muted">{slotError}</p>
                <Button variant="ghost" className="mt-3" onClick={() => setDate(date)}>
                  Tentar de novo
                </Button>
              </CardBody>
            </Card>
          )}

          {!loadingSlots && !slotError && slots.length === 0 && (
            <Card>
              <CardBody>
                <p className="text-sm text-fg-muted">
                  Nenhum horário livre nesse dia. Escolha outra data ou outro professor.
                </p>
              </CardBody>
            </Card>
          )}

          {!loadingSlots && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {slots.map((s) => (
                <button
                  key={s.iso}
                  type="button"
                  onClick={() => setSelectedSlot(s)}
                  className={`rounded-lg border py-2 text-sm transition-all duration-150 ${
                    selectedSlot?.iso === s.iso
                      ? 'border-brand bg-brand text-brand-fg'
                      : 'border-border bg-surface text-fg hover:border-brand'
                  }`}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => setStep(2)}>
              Voltar
            </Button>
            <Button
              variant="primary"
              disabled={!selectedSlot || submitting}
              onClick={confirm}
            >
              {submitting ? 'Confirmando...' : 'Confirmar agendamento'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
