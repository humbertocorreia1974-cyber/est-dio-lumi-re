"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: any;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
}

export default function BookingClientForm({
  services,
  professionals
}: {
  services: Service[];
  professionals: Professional[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("08:00");
  const [observations, setObservations] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const availableTimes = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00", "18:30"];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          professionalId: selectedProfessional,
          schedulingDate: `${date}T${time}:00.000Z`,
          observations
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar agendamento");
      }

      setSuccessCode(data.confirmationCode);
      setStep(4);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (successCode) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-display font-bold text-fg">Agendamento Confirmado!</h2>
        <p className="text-fg-muted max-w-md mx-auto">
          Sua sessão foi agendada com sucesso em nosso estúdio. Guarde seu código de confirmação para atendimento rápido.
        </p>
        <div className="p-4 bg-bg border border-border rounded-xl inline-block font-mono text-xl font-bold text-brand tracking-wider">
          {successCode}
        </div>
        <div className="pt-4 flex justify-center gap-4">
          <Button variant="primary" onClick={() => router.push("/meus-agendamentos")}>
            Ver Meus Agendamentos
          </Button>
          <Button variant="ghost" onClick={() => { setSuccessCode(null); setStep(1); }}>
            Novo Agendamento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleBookingSubmit} className="space-y-8">
      {/* Indicador de Passos */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        {[
          { num: 1, label: "Modalidade" },
          { num: 2, label: "Profissional" },
          { num: 3, label: "Data e Horário" }
        ].map((s) => (
          <div key={s.num} className={`flex items-center gap-2 ${step >= s.num ? "text-brand font-semibold" : "text-fg-muted"}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= s.num ? "bg-brand text-white" : "bg-bg border border-border"}`}>
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Passo 1: Seleção de Serviço */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-semibold text-fg">Selecione a Modalidade</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedService === service.id
                    ? "border-brand bg-brand/5 shadow-md"
                    : "border-border bg-bg hover:border-brand/40"
                }`}
              >
                <h3 className="font-semibold text-lg text-fg">{service.name}</h3>
                <p className="text-sm text-fg-muted mt-1">{service.duration} minutos</p>
                <div className="mt-4 font-bold text-brand">
                  R$ {Number(service.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="primary"
              disabled={!selectedService}
              onClick={() => setStep(2)}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Passo 2: Seleção de Profissional */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-semibold text-fg">Escolha o Instrutor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {professionals.map((prof) => (
              <div
                key={prof.id}
                onClick={() => setSelectedProfessional(prof.id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                  selectedProfessional === prof.id
                    ? "border-brand bg-brand/5 shadow-md"
                    : "border-border bg-bg hover:border-brand/40"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-lg">
                  {prof.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-fg">{prof.name}</h3>
                  <p className="text-sm text-fg-muted">{prof.specialty}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={!selectedProfessional}
              onClick={() => setStep(3)}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Passo 3: Data, Horário e Observações */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-semibold text-fg">Escolha Data e Horário</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-fg flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand" /> Data da Sessão
              </label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-fg flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" /> Horários Disponíveis
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`py-2 text-sm rounded-lg border transition-all ${
                      time === t
                        ? "bg-brand text-white border-brand"
                        : "bg-bg border-border text-fg hover:border-brand/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-fg flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand" /> Observações ou Necessidades Especiais (Opcional)
            </label>
            <textarea
              className="w-full rounded-xl border border-border bg-bg p-3 text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-brand"
              rows={3}
              placeholder="Ex: Restrição de lombar, gestante, etc."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="ghost" onClick={() => setStep(2)}>
              Voltar
            </Button>
            <Button type="submit" variant="primary" disabled={loading || !date}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Agendamento"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
