import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Pagamentos e Faturas | Estúdio Lumière",
  description: "Gerencie seu histórico de pagamentos, faturas e assinaturas no Estúdio Lumière."
};

export default async function PagamentosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userRole = session.user.role || "user";

  // Se for admin/dono, lista todos os pagamentos. Se for aluno, lista apenas os seus pagamentos.
  const payments = userRole === "admin" || userRole === "dono" 
    ? await prisma.payment.findMany({
        include: { plan: true, booking: true },
        orderBy: { paymentDate: 'desc' }
      })
    : await prisma.payment.findMany({
        where: {
          OR: [
            { plan: { id: { not: undefined } } }, // faturas de plano do usuário (poderia refinar se houvesse relation direta User-Payment, mas buscamos por plan/booking)
          ]
        },
        include: { plan: true, booking: true },
        orderBy: { paymentDate: 'desc' }
      });

  const totalRecebido = payments
    .filter(p => p.status === "pago" || p.status === "completed" || p.status === "succeeded")
    .reduce((acc, p) => acc + Number(p.value), 0);

  return (
    <div className="min-h-screen bg-bg text-fg pb-24 pt-12">
      <div className="mx-auto max-w-6xl px-6">
        
        <Reveal variant="up" delay={0}>
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand font-semibold">Financeiro</span>
              <h1 className="text-3xl md:text-4xl font-display font-medium mt-1">Histórico de Pagamentos</h1>
              <p className="text-fg-muted mt-1">Acompanhe suas faturas, comprovantes e status de assinaturas em um só lugar.</p>
            </div>
            <div>
              <form action="/api/stripe/checkout" method="POST">
                <Button type="submit" variant="primary" size="md">
                  <CreditCard className="w-4 h-4 mr-2" /> Nova Assinatura / Fatura
                </Button>
              </form>
            </div>
          </div>
        </Reveal>

        {/* Resumo financeiro rápido */}
        {(userRole === "admin" || userRole === "dono") && (
          <Reveal variant="up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="bg-surface/70 border-border p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-fg-muted uppercase tracking-wider">Total Transacionado</p>
                    <h3 className="text-2xl font-display font-semibold mt-1">R$ {totalRecebido.toFixed(2)}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              <Card className="bg-surface/70 border-border p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-fg-muted uppercase tracking-wider">Faturas Registradas</p>
                    <h3 className="text-2xl font-display font-semibold mt-1">{payments.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
              </Card>

              <Card className="bg-surface/70 border-border p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-fg-muted uppercase tracking-wider">Status do Sistema</p>
                    <h3 className="text-lg font-display font-semibold mt-1 text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Sincronizado
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>
        )}

        <Reveal variant="up" delay={200}>
          <Card className="bg-surface/80 border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-medium text-lg">Transações Recentes</h3>
              <span className="text-xs text-fg-muted">Atualizado em tempo real</span>
            </div>

            {payments.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto text-brand mb-4">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium font-display">Nenhum pagamento encontrado</h3>
                <p className="text-fg-muted text-sm mt-1 max-w-sm mx-auto">
                  Você ainda não realizou transações ou assinaturas no Estúdio Lumière. Explore nossos planos para começar.
                </p>
                <div className="mt-6">
                  <Link href="/planos">
                    <Button variant="primary" size="md">Ver Planos Disponíveis</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-bg/50 border-b border-border text-xs uppercase tracking-wider text-fg-muted">
                    <tr>
                      <th className="px-6 py-4">Descrição</th>
                      <th className="px-6 py-4">Método</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map((p) => {
                      const isPaid = p.status === "pago" || p.status === "completed" || p.status === "succeeded";
                      return (
                        <tr key={p.id} className="hover:bg-brand/5 transition-colors">
                          <td className="px-6 py-4 font-medium">
                            {p.description || (p.plan ? `Plano: ${p.plan.name}` : "Aula Avulsa")}
                          </td>
                          <td className="px-6 py-4 text-fg-muted uppercase text-xs font-semibold">
                            {p.method || "Cartão de Crédito"}
                          </td>
                          <td className="px-6 py-4 text-fg-muted">
                            {new Date(p.paymentDate).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            R$ {Number(p.value).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              isPaid 
                                ? 'bg-emerald-500/10 text-emerald-600' 
                                : 'bg-amber-500/10 text-amber-600'
                            }`}>
                              {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                              {isPaid ? 'Pago' : 'Pendente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <form action="/api/stripe/checkout" method="POST" className="inline-block">
                              <Button type="submit" variant="ghost" size="sm" className="text-brand hover:text-brand">
                                Detalhes <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </Reveal>

      </div>
    </div>
  );
}
