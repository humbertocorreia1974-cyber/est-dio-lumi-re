"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: string;
}

export default function BookingActionsClient({ bookingId, currentStatus }: BookingActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (currentStatus === "cancelled") {
    return <span className="text-xs text-fg-muted italic">Cancelado</span>;
  }

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) throw new Error("Erro ao cancelar");
      router.refresh();
    } catch (err) {
      alert("Não foi possível cancelar o agendamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        disabled={loading}
        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 text-xs"
      >
        {loading ? "Cancelando..." : "Cancelar"}
      </Button>
    </div>
  );
}
