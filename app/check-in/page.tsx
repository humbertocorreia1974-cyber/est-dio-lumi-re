import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CheckInClient from "./check-in-client";
import { Reveal } from "@/components/motion/reveal";
import ASSETS from "@/lib/assets";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Check-In Diário | Estúdio Lumière",
  description: "Realize seu check-in para as aulas de pilates e yoga com tranquilidade.",
  openGraph: {
    title: "Check-In Diário | Estúdio Lumière",
    description: "Plataforma premium de agendamento e gestão.",
  },
};

export default async function CheckInPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect("/login?callbackUrl=/check-in");
  }

  const isAdminOrStaff = ["admin", "professor", "recepcao"].includes(session.user.role);

  const whereClause = isAdminOrStaff ? {} : { userId: session.user.id };

  const bookings = await prisma.booking.findMany({
    where: whereClause,
    include: {
      class: true,
      checkIn: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { schedulingDate: "asc" },
    take: 20,
  });

  return (
    <main className="min-h-screen bg-bg py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <Reveal variant="up" delay={0}>
          <div className="text-center space-y-4">
            <div className="inline-block p-2 rounded-2xl bg-surface border border-border shadow-sm mb-2">
              <img src={ASSETS.logo} alt={ASSETS.name} className="h-10 w-auto mx-auto" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-fg">Check-In Diário</h1>
            <p className="text-lg text-fg-muted max-w-xl mx-auto">
              Confirme sua presença nas aulas do dia e prepare-se para momentos de equilíbrio e bem-estar.
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <CheckInClient initialBookings={bookings} />
        </Reveal>
      </div>
    </main>
  );
}
