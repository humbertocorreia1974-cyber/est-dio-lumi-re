import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://exemplo.com';
  const routes = ["/","/sobre","/galeria","/planos","/agendamento","/modalidades","/professores","/aulas","/agendamento/calendario","/meus-agendamentos","/progresso","/check-in","/perfil","/usuarios","/pagamentos","/entrar","/cadastro","/esqueci-senha","/primeiros-passos","/termos","/privacidade","/servicos","/agendamento/novo","/cadastro/sucesso","/agendar","/agendamento/confirmacao","/meu-plano","/meu-plano/renovar"];
  return routes.map((r) => ({ url: base + (r === '/' ? '' : r), lastModified: new Date(), changeFrequency: 'weekly' as const, priority: r === '/' ? 1 : 0.6 }));
}
