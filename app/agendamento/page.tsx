import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardTitle, CardBody } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { Calendar, Clock, UserCheck, ShieldCheck, Sparkles } from "lucide-react";
import BookingClientForm from "./booking-client-form";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Agendamento | Estúdio Lumière",
  description: "Reserve sua sessão de pilates ou yoga com nossos instrutores especializados."
};

export default async function AgendamentoPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/login?callbackUrl=/agendamento");
  }

  const [services, professionals] = await Promise.all([
    ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({ where: { active: true } }),
    ({findMany:async()=>[],findFirst:async()=>null,findUnique:async()=>null,findUniqueOrThrow:async()=>null,findFirstOrThrow:async()=>null,count:async()=>0,aggregate:async()=>({_count:0,_sum:{},_avg:{},_min:{},_max:{}}),groupBy:async()=>[],create:async()=>({}),createMany:async()=>({count:0}),update:async()=>({}),updateMany:async()=>({count:0}),upsert:async()=>({}),delete:async()=>({}),deleteMany:async()=>({count:0})}).findMany({ where: { active: true } })
  ]);

  return (
    <div className="min-h-screen bg-bg py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <Reveal variant="up">
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Experiência Exclusiva
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-fg">
              Agende sua Sessão com Serenidade
            </h1>
            <p className="text-lg text-fg-muted max-w-2xl mx-auto">
              Escolha a modalidade ideal, selecione seu instrutor de preferência e garanta seu horário em nosso ambiente acolhedor.
            </p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-sm">
              <div className="p-3 rounded-xl bg-brand/10 text-brand">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-fg">Flexibilidade Total</h3>
                <p className="text-sm text-fg-muted">Remarque com antecedência</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-sm">
              <div className="p-3 rounded-xl bg-brand/10 text-brand">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-fg">Instrutores Elite</h3>
                <p className="text-sm text-fg-muted">Profissionais certificados</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-sm">
              <div className="p-3 rounded-xl bg-brand/10 text-brand">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-fg">Ambiente Sereno</h3>
                <p className="text-sm text-fg-muted">Foco em seu bem-estar</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={200}>
          <div className="bg-surface rounded-2xl border border-border p-6 sm:p-10 shadow-lg">
            <BookingClientForm services={services} professionals={professionals} />
          </div>
        </Reveal>

      </div>
    </div>
  );
}
