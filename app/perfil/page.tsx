export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";

export const metadata = {
  title: "Meu Perfil | Estúdio Lumière",
  description: "Gerencie suas informações pessoais, plano e preferências no Estúdio Lumière.",
};

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/login?callbackUrl=/perfil");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      plan: true,
      bookings: {
        include: { class: true },
        orderBy: { schedulingDate: "desc" },
        take: 5
      },
      payments: {
        orderBy: { paymentDate: "desc" },
        take: 5
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Hero do Perfil */}
        <Reveal variant="up">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border pb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand font-medium">Área do Aluno</span>
              <h1 className="text-3xl md:text-4xl font-display text-fg mt-1">Meu Perfil</h1>
              <p className="text-fg-muted mt-2">Gerencie seus dados de acesso, acompanhe seu plano e histórico no estúdio.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/planos">
                <Button variant="primary">Ver Planos</Button>
              </Link>
              <Link href="/meus-agendamentos">
                <Button variant="ghost">Meus Agendamentos</Button>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Informações Pessoais */}
          <div className="lg:col-span-1 space-y-6">
            <Reveal variant="left" delay={100}>
              <Card className="bg-surface border-border p-6 rounded-2xl shadow-sm">
                <CardTitle className="text-xl font-display text-fg mb-4">Dados Pessoais</CardTitle>
                <CardBody className="space-y-4 text-sm text-fg-muted">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-fg-muted/70">Nome Completo</span>
                    <span className="text-base text-fg font-medium">{user.name || "Não informado"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-fg-muted/70">E-mail de Acesso</span>
                    <span className="text-base text-fg font-medium">{user.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-fg-muted/70">Telefone / WhatsApp</span>
                    <span className="text-base text-fg font-medium">{user.phone || "Não cadastrado"}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-fg-muted/70">Membro desde</span>
                    <span className="text-base text-fg font-medium">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <form action="/api/user/update" method="POST" className="space-y-3">
                      <div>
                        <label className="block text-xs text-fg-muted mb-1">Atualizar Telefone</label>
                        <input 
                          type="text" 
                          name="phone" 
                          defaultValue={user.phone || ""} 
                          placeholder="(00) 00000-0000"
                          className="w-full px-3 py-2 bg-bg border border-border rounded-md text-sm text-fg focus:outline-none focus:border-brand"
                        />
                      </div>
                      <Button type="submit" variant="secondary" className="w-full">Salvar Alterações</Button>
                    </form>
                  </div>
                </CardBody>
              </Card>
            </Reveal>

            {/* Plano Atual */}
            <Reveal variant="left" delay={200}>
              <Card className="bg-surface border-border p-6 rounded-2xl shadow-sm">
                <CardTitle className="text-xl font-display text-fg mb-4">Seu Plano</CardTitle>
                <CardBody className="space-y-4">
                  {user.plan ? (
                    <div className="p-4 bg-brand/10 rounded-xl border border-brand/20">
                      <span className="text-xs uppercase tracking-wider text-brand font-semibold">Ativo</span>
                      <h3 className="text-lg font-display text-fg mt-1">{user.plan.name}</h3>
                      <p className="text-xs text-fg-muted mt-1">{user.plan.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="font-medium text-fg">R$ {Number(user.plan.price).toFixed(2)}</span>
                        <Link href="/meu-plano">
                          <span className="text-brand hover:underline text-xs font-medium">Gerenciar plano →</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-fg-muted mb-4">Você ainda não possui um plano ativo no Estúdio Lumière.</p>
                      <Link href="/planos">
                        <Button variant="primary" className="w-full">Escolher Plano</Button>
                      </Link>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Reveal>
          </div>

          {/* Histórico Recente e Pagamentos */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Últimos Agendamentos */}
            <Reveal variant="right" delay={150}>
              <Card className="bg-surface border-border p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-xl font-display text-fg">Últimos Agendamentos</CardTitle>
                  <Link href="/meus-agendamentos" className="text-xs text-brand hover:underline font-medium">Ver todos</Link>
                </div>
                <CardBody>
                  {user.bookings.length === 0 ? (
                    <div className="text-center py-8 text-fg-muted">
                      <p className="text-sm">Nenhum agendamento realizado ainda.</p>
                      <Link href="/agendamento" className="inline-block mt-3">
                        <Button variant="primary" size="sm">Agendar Aula</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-fg">
                        <thead className="text-xs uppercase bg-bg/50 text-fg-muted">
                          <tr>
                            <th className="px-4 py-3">Aula</th>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {user.bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-bg/30">
                              <td className="px-4 py-3 font-medium">{booking.class.name}</td>
                              <td className="px-4 py-3 text-fg-muted">
                                {new Date(booking.schedulingDate).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  booking.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600" :
                                  booking.status === "cancelled" ? "bg-rose-500/10 text-rose-600" :
                                  "bg-amber-500/10 text-amber-600"
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
                </CardBody>
              </Card>
            </Reveal>

            {/* Histórico de Pagamentos */}
            <Reveal variant="right" delay={250}>
              <Card className="bg-surface border-border p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-xl font-display text-fg">Histórico de Pagamentos</CardTitle>
                </div>
                <CardBody>
                  {user.payments.length === 0 ? (
                    <p className="text-sm text-fg-muted text-center py-6">Nenhum pagamento registrado no sistema.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-fg">
                        <thead className="text-xs uppercase bg-bg/50 text-fg-muted">
                          <tr>
                            <th className="px-4 py-3">Descrição</th>
                            <th className="px-4 py-3">Data</th>
                            <th className="px-4 py-3">Valor</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {user.payments.map((payment) => (
                            <tr key={payment.id} className="hover:bg-bg/30">
                              <td className="px-4 py-3 font-medium">{payment.description}</td>
                              <td className="px-4 py-3 text-fg-muted">
                                {new Date(payment.paymentDate).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="px-4 py-3 text-fg-muted">R$ {Number(payment.value).toFixed(2)}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Reveal>

          </div>

        </div>

      </div>
    </div>
  );
}
