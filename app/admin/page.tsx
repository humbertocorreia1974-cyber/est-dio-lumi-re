import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import Link from "next/link";
import Image from "next/image";
import ASSETS from "@/lib/assets";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Painel do Administrador | Estúdio Lumière",
  description: "Visão geral e métricas principais da gestão do estúdio.",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const [totalUsers, totalBookings, totalClasses, recentBookings, paymentsSum] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.class.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { schedulingDate: 'desc' },
      include: { user: true, class: true }
    }),
    prisma.payment.aggregate({
      _sum: { value: true },
      where: { status: 'completed' }
    })
  ]);

  const receitaTotal = paymentsSum._sum.value ? Number(paymentsSum._sum.value) : 0;

  return (
    <div className="min-h-screen bg-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cabeçalho */}
        <Reveal variant="up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand font-semibold">Gestão Estratégica</span>
              <h1 className="text-4xl font-display font-bold text-fg mt-1">Painel do Administrador</h1>
              <p className="text-fg-muted mt-1">Acompanhe as principais métricas e o fluxo do Estúdio Lumière em tempo real.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/servicos" className="inline-flex items-center justify-center rounded-lg bg-brand text-brand-fg px-4 py-2.5 text-sm font-medium hover-lift transition">
                Gerenciar Aulas
              </Link>
              <Link href="/admin/professores" className="inline-flex items-center justify-center rounded-lg border border-border bg-surface text-fg px-4 py-2.5 text-sm font-medium hover-lift transition">
                Professores
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Reveal variant="scale" delay={100}>
            <div className="rounded-2xl bg-surface p-6 border border-border hover-lift shadow-sm">
              <span className="text-sm font-medium text-fg-muted">Total de Alunos</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-fg">
                  <CountUp to={totalUsers} />
                </span>
                <span className="text-xs text-brand font-medium">cadastrados</span>
              </div>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={200}>
            <div className="rounded-2xl bg-surface p-6 border border-border hover-lift shadow-sm">
              <span className="text-sm font-medium text-fg-muted">Agendamentos</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-fg">
                  <CountUp to={totalBookings} />
                </span>
                <span className="text-xs text-brand font-medium">realizados</span>
              </div>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={300}>
            <div className="rounded-2xl bg-surface p-6 border border-border hover-lift shadow-sm">
              <span className="text-sm font-medium text-fg-muted">Aulas Ativas</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-fg">
                  <CountUp to={totalClasses} />
                </span>
                <span className="text-xs text-brand font-medium">modalidades</span>
              </div>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={400}>
            <div className="rounded-2xl bg-surface p-6 border border-border hover-lift shadow-sm">
              <span className="text-sm font-medium text-fg-muted">Receita Aprovada</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-fg">
                  R$ <CountUp to={receitaTotal} />
                </span>
                <span className="text-xs text-brand font-medium">total</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Seção inferior: Atividades Recentes e Atalhos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Agendamentos Recentes */}
          <div className="lg:col-span-2 rounded-2xl bg-surface p-6 border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-fg">Últimos Agendamentos</h2>
              <span className="text-xs text-fg-muted">Atualizado agora</span>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-12 text-fg-muted">
                <p>Nenhum agendamento registrado até o momento.</p>
                <Link href="/agendamento" className="mt-3 inline-block text-sm text-brand font-semibold hover:underline">
                  Criar novo agendamento
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-fg-muted uppercase text-xs">
                    <tr>
                      <th className="pb-3 font-semibold">Aluno</th>
                      <th className="pb-3 font-semibold">Aula</th>
                      <th className="pb-3 font-semibold">Data</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-brand/5 transition">
                        <td className="py-4 font-medium text-fg">{booking.user?.name || booking.user?.email}</td>
                        <td className="py-4 text-fg-muted">{booking.class?.name}</td>
                        <td className="py-4 text-fg-muted">{new Date(booking.schedulingDate).toLocaleDateString("pt-BR")}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Atalhos e Estado do Sistema */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-surface p-6 border border-border shadow-sm space-y-4">
              <h2 className="text-xl font-display font-bold text-fg">Atalhos Rápidos</h2>
              <div className="flex flex-col gap-3">
                <Link href="/meus-agendamentos" className="p-3 rounded-xl bg-bg hover:bg-brand/5 border border-border text-sm font-medium text-fg transition flex items-center justify-between">
                  <span>Ver Todos os Agendamentos</span>
                  <span className="text-brand">→</span>
                </Link>
                <Link href="/planos" className="p-3 rounded-xl bg-bg hover:bg-brand/5 border border-border text-sm font-medium text-fg transition flex items-center justify-between">
                  <span>Planos de Assinatura</span>
                  <span className="text-brand">→</span>
                </Link>
                <Link href="/progresso" className="p-3 rounded-xl bg-bg hover:bg-brand/5 border border-border text-sm font-medium text-fg transition flex items-center justify-between">
                  <span>Progresso e Medidas</span>
                  <span className="text-brand">→</span>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-brand/5 p-6 border border-brand/20 space-y-3">
              <h3 className="font-display font-bold text-brand text-lg">Estúdio Lumière</h3>
              <p className="text-sm text-fg-muted leading-relaxed">
                Sistema operando com total serenidade. Certifique-se de revisar os horários de pico e as reservas semanais de pilates e yoga.
              </p>
              <div className="pt-2">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-brand">Modo Administrador Ativo</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
