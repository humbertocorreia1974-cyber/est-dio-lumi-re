import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Usuários e Alunos | Estúdio Lumière",
  description: "Gerenciamento de alunos, professores e equipe do Estúdio Lumière.",
};

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== 'admin' && session.user.role !== 'dono')) {
    redirect('/');
  }

  const query = searchParams.q || '';
  const roleFilter = searchParams.role || '';

  const whereClause: any = {};
  if (query) {
    whereClause.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
    ];
  }
  if (roleFilter) {
    whereClause.role = roleFilter;
  }

  const usuarios = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
      phone: true,
    },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-bg text-fg py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cabeçalho */}
        <Reveal variant="up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Gestão de Usuários</h1>
              <p className="text-fg-muted mt-1">Visualize e administre alunos, professores e equipe cadastrados no estúdio.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/admin" 
                className="inline-flex items-center justify-center rounded-xl bg-surface border border-border px-4 py-2 text-sm font-medium hover:bg-surface/80 transition-all duration-150"
              >
                Voltar ao Painel
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Filtros e Busca */}
        <Reveal variant="up" delay={100}>
          <form method="GET" className="bg-surface/50 border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-1/2">
              <label htmlFor="q" className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Buscar por nome ou e-mail</label>
              <input 
                type="text" 
                id="q" 
                name="q" 
                defaultValue={query} 
                placeholder="Ex: Ana Clara" 
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="w-full sm:w-1/4">
              <label htmlFor="role" className="block text-xs font-semibold text-fg-muted uppercase tracking-wider mb-2">Filtrar por Papel</label>
              <select 
                id="role" 
                name="role" 
                defaultValue={roleFilter} 
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="">Todos os papéis</option>
                <option value="user">Aluno (user)</option>
                <option value="professor">Professor</option>
                <option value="recepcao">Recepção</option>
                <option value="dono">Dono</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="w-full sm:w-auto flex items-end sm:self-end pt-2 sm:pt-0">
              <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-2.5 bg-brand text-brand-fg font-medium rounded-xl hover:opacity-90 transition-all duration-150 text-sm shadow-sm"
              >
                Filtrar
              </button>
            </div>
          </form>
        </Reveal>

        {/* Tabela de Usuários */}
        <Reveal variant="up" delay={200}>
          <div className="bg-surface/70 border border-border rounded-2xl shadow-sm overflow-hidden backdrop-blur-sm">
            {usuarios.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <p className="text-fg-muted text-base">Nenhum usuário encontrado com os filtros selecionados.</p>
                <Link 
                  href="/usuarios" 
                  className="inline-block px-4 py-2 bg-brand text-brand-fg text-sm font-medium rounded-xl hover:opacity-90 transition"
                >
                  Limpar filtros
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface border-b border-border text-xs uppercase tracking-wider text-fg-muted font-semibold">
                    <tr>
                      <th className="px-6 py-4">Nome / E-mail</th>
                      <th className="px-6 py-4">Papel</th>
                      <th className="px-6 py-4">Telefone</th>
                      <th className="px-6 py-4">Cadastro</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {usuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="font-medium text-fg">{u.name || 'Sem nome'}</div>
                          <div className="text-xs text-fg-muted">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'admin' || u.role === 'dono' 
                              ? 'bg-accent/20 text-accent' 
                              : u.role === 'professor' 
                              ? 'bg-brand/20 text-brand' 
                              : 'bg-surface border border-border text-fg-muted'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-fg-muted">
                          {u.phone || 'Não informado'}
                        </td>
                        <td className="px-6 py-4 text-fg-muted">
                          {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link 
                            href={`mailto:${u.email}`} 
                            className="text-xs font-medium text-brand hover:underline"
                          >
                            Contatar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Reveal>

      </div>
    </div>
  );
}
