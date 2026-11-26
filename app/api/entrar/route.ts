import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Body = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
  const __session = await getServerSession(authOptions as any);
  if (!(__session as any)?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'A senha precisa ter pelo menos 6 caracteres.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos. Confira os dados e tente novamente.' },
        { status: 401 },
      );
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: 'E-mail ou senha incorretos. Confira os dados e tente novamente.' },
        { status: 401 },
      );
    }

    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível validar o acesso agora. Tente novamente em instantes.' },
      { status: 500 },
    );
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/entrar/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}