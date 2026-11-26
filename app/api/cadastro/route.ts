import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

type Payload = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  termsAccepted?: boolean;
};

export async function POST(request: Request) {
  try {
  const __session = await getServerSession(authOptions as any);
  if (!(__session as any)?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const password = body.password ?? '';
  const phone = body.phone ? String(body.phone).trim() : null;
  const termsAccepted = Boolean(body.termsAccepted);

  if (name.length < 2) {
    return NextResponse.json({ error: 'Informe seu nome completo.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'A senha precisa ter ao menos 8 caracteres.' },
      { status: 400 },
    );
  }
  if (!termsAccepted) {
    return NextResponse.json(
      { error: 'É necessário aceitar os Termos e a Política de Privacidade.' },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: 'Já existe uma conta com este e-mail. Tente entrar.' },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      phone,
      role: 'user',
      termsAcceptedAt: new Date(),
    },
    select: { id: true, name: true, email: true },
  });

  try {
    await sendWelcomeEmail(user.email, user.name ?? name);
  } catch (err) {
    console.error('[cadastro] falha ao enviar e-mail de boas-vindas', err);
  }

  return NextResponse.json({ ok: true, user }, { status: 201 });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/cadastro/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
