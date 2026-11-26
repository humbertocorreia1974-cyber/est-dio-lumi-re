import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professores | Estúdio Lumière",
  description:
    "Conheça o time de professores do Estúdio Lumière e gerencie o cadastro de profissionais do estúdio.",
};

type Professor = {
  id: string;
  nome: string;
  especialidade: string;
  modalidades: string[];
  bio: string;
  status: "ativo" | "inativo" | "ferias";
  aulasSemana: number;
  alunos: number;
  desde: string;
  iniciais: string;
};

const professores: Professor[] = [
  {
    id: "ana-lumiere",
    nome: "Ana Beatriz Costa",
    especialidade: "Pilates Clássico & Reabilitação",
    modalidades: ["Pilates", "Reabilitação"],
    bio: "Fisioterapeuta com 12 anos de experiência em Pilates terapêutico e reabilitação pós-cirúrgica.",
    status: "ativo",
    aulasSemana: 14,
    alunos: 38,
    desde: "2019",
    iniciais: "AC",
  },
  {
    id: "carlos-mendes",
    nome: "Carlos Mendes",
    especialidade: "Yoga Vinyasa & Meditação",
    modalidades: ["Yoga", "Meditação"],
    bio: "Instrutor certificado em Rishikesh, conduz práticas de Vinyasa e meditação guiada com foco em respiração.",
    status: "ativo",
    aulasSemana: 10,
    alunos: 27,
    desde: "2021",
    iniciais: "CM",
  },
  {
    id: "juliana-reis",
    nome: "Juliana Reis",
    especialidade: "Pilates Contemporâneo",
    modalidades: ["Pilates", "Alongamento"],
    bio: "Especialista em Pilates em aparelhos, com formação em método contemporâneo e foco em postura.",
    status: "ativo",
    aulasSemana: 12,
    alunos: 31,
    desde: "2020",
    iniciais: "JR",
  },
  {
    id: "rafael-souza",
    nome: "Rafael Souza",
    especialidade: "Yoga Restaurativa",
    modalidades: ["Yoga", "Yin Yoga"],
    bio: "Professor de Yoga Restaurativa e Yin Yoga, com abordagem acolhedora para iniciantes e gestantes.",
    status: "ferias",
    aulasSemana: 0,
    alunos: 19,
    desde: "2022",
    iniciais: "RS",
  },
  {
    id: "marina-alves",
    nome: "Marina Alves",
    especialidade: "Pilates para Gestantes",
    modalidades: ["Pilates", "Gestantes"],
    bio: "Fisioterapeuta especializada em Pilates para gestantes e pós-parto, com atendimento humanizado.",
    status: "ativo",
    aulasSemana: 8,
    alunos: 22,
    desde: "2023",
    iniciais: "MA",
  },
  {
    id: "pedro-lima",
    nome: "Pedro Lima",
    especialidade: "Yoga para Atletas",
    modalidades: ["Yoga", "Mobilidade"],
    bio: "Preparador físico e instrutor de Yoga, foca em mobilidade e recuperação para praticantes de alta performance.",
    status: "inativo",
    aulasSemana: 0,
    alunos: 0,
    desde: "2024",
    iniciais: "PL",
  },
];

const statusStyles: Record<Professor["status"], string> = {
  ativo: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20",
  inativo: "bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))] border-[hsl(var(--danger))]/20",
  ferias: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning-fg))] border-[hsl(var(--warning))]/30",
};

const statusLabels: Record<Professor["status"], string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  ferias: "Em férias",
};

export default function ProfessoresAdminPage() {
  const totalAtivos = professores.filter((p) => p.status === "ativo").length;
  const totalAulas = professores.reduce((acc, p) => acc + p.aulasSemana, 0);
  const totalAlunos = professores.reduce((acc, p) => acc + p.alunos, 0);

  return (
    <main className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Trilha de navegação" className="mb-6 text-sm text-[hsl(var(--fg-muted))]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/admin" className="hover:text-[hsl(var(--brand))] transition-colors">
                Admin
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-[hsl(var(--fg))]">Professores</li>
          </ol>
        </nav>

        {/* Hero */}
        <header className="mb-8 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--brand))]">
                Gestão de equipe
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight sm:text-4xl">
                Professores
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--fg-muted))] sm:text-base">
                Acompanhe o time de professores do Estúdio Lumière, suas modalidades, carga
                semanal e alunos vinculados. Gerencie cadastros, status e disponibilidade
                com tranquilidade.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--fg))] transition-colors hover:bg-[hsl(var(--surface-2))]"
              >
                Voltar ao painel
              </Link>
              <Link
                href="/professores"
                className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--brand))] px-4 py-2.5 text-sm font-semibold text-[hsl(var(--brand-fg))] transition-opacity hover:opacity-90"
              >
                Ver página pública
              </Link>
            </div>
          </div>
        </header>

        {/* KPIs */}
        <section aria-label="Resumo da equipe" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--fg-muted))]">
              Professores ativos
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
              {totalAtivos}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--fg-muted))]">
              de {professores.length} cadastrados
            </p>
          </div>
          <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--fg-muted))]">
              Aulas por semana
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
              {totalAulas}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--fg-muted))]">somatório da equipe ativa</p>
          </div>
          <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--fg-muted))]">
              Alunos vinculados
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold">
              {totalAlunos}
            </p>
            <p className="mt-1 text-xs text-[hsl(var(--fg-muted))]">em acompanhamento</p>
          </div>
        </section>

        {/* Lista de professores */}
        <section aria-labelledby="lista-professores" className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2
              id="lista-professores"
              className="font-[family-name:var(--font-display)] text-xl font-semibold"
            >
              Equipe
            </h2>
            <span className="text-xs text-[hsl(var(--fg-muted))]">
              {professores.length} professores
            </span>
          </div>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {professores.map((prof) => (
              <li
                key={prof.id}
                className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))] font-[family-name:var(--font-display)] text-base font-semibold text-[hsl(var(--accent-fg))]"
                  >
                    {prof.iniciais}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-[hsl(var(--fg))]">
                        {prof.nome}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyles[prof.status]}`}
                      >
                        {statusLabels[prof.status]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-[hsl(var(--fg-muted))]">
                      {prof.especialidade}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--fg-muted))]">
                      {prof.bio}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {prof.modalidades.map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center rounded-full bg-[hsl(var(--surface-2))] px-2.5 py-0.5 text-[11px] font-medium text-[hsl(var(--fg-muted))]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>

                    <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[hsl(var(--border))] pt-3 text-center">
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                          Aulas/sem
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold">{prof.aulasSemana}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                          Alunos
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold">{prof.alunos}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[hsl(var(--fg-muted))]">
                          Desde
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold">{prof.desde}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Ações rápidas */}
        <section
          aria-labelledby="acoes-rapidas"
          className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-2))] p-6"
        >
          <h2
            id="acoes-rapidas"
            className="font-[family-name:var(--font-display)] text-lg font-semibold"
          >
            Ações rápidas
          </h2>
          <p className="mt-1 text-sm text-[hsl(var(--fg-muted))]">
            Atalhos para as principais tarefas de gestão do estúdio.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/usuarios"
              className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm font-medium transition-colors hover:bg-[hsl(var(--surface-2))]"
            >
              Gestão de usuários
            </Link>
            <Link
              href="/aulas"
              className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm font-medium transition-colors hover:bg-[hsl(var(--surface-2))]"
            >
              Gestão de aulas
            </Link>
            <Link
              href="/pagamentos"
              className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm font-medium transition-colors hover:bg-[hsl(var(--surface-2))]"
            >
              Gestão de pagamentos
            </Link>
            <Link
              href="/admin"
              className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 text-sm font-medium transition-colors hover:bg-[hsl(var(--surface-2))]"
            >
              Painel principal
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}