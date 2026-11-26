"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CheckInClient({ initialBookings }: { initialBookings: any[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleCheckIn = async (bookingId: string) => {
    setLoadingId(bookingId);
    setFeedback(null);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao fazer check-in");

      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, checkIn: data.checkIn } : b))
      );
      setFeedback({ type: "success", message: "Presença confirmada com serenidade. Bom treino!" });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className={`p-4 rounded-xl text-sm ${feedback.type === "success" ? "bg-brand/10 text-brand border border-brand/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
          {feedback.message}
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="p-12 text-center bg-surface/50 border border-border rounded-2xl">
          <p className="text-fg-muted mb-4">Nenhuma aula agendada para hoje ou pendente de check-in.</p>
          <Button asChild variant="primary">
            <a href="/agendamento">Agendar uma Aula</a>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map(b => {
            const hasCheckedIn = !!b.checkIn;
            const dateFormatted = new Date(b.schedulingDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card key={b.id} className="p-6 bg-surface border border-border rounded-2xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-brand/10 text-brand">
                      {b.class.type}
                    </span>
                    <span className="text-xs text-fg-muted font-mono">#{b.confirmationCode}</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-fg mb-1">{b.class.name}</h3>
                  <p className="text-sm text-fg-muted mb-2">Horário: {dateFormatted}</p>
                  <p className="text-xs text-fg-muted">Duração: {b.class.duration} minutos | Nível: {b.class.level}</p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  {hasCheckedIn ? (
                    <div className="flex items-center space-x-2 text-brand text-sm font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span>Check-in realizado às {b.checkIn.hour}</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleCheckIn(b.id)}
                      disabled={loadingId === b.id}
                      variant="primary"
                      className="w-full"
                    >
                      {loadingId === b.id ? "Confirmando..." : "Fazer Check-In"}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
