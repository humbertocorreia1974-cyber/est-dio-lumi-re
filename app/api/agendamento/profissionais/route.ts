import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");
  if (!classId) {
    return NextResponse.json({ profissionais: [] });
  }

  const profs = await prisma.user.findMany({
    where: { role: { in: ["professor", "admin", "dono"] } },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
    take: 20,
  });

  return NextResponse.json({
    profissionais: profs.map((p) => ({
      id: p.id,
      name: p.name || "Professor(a)",
      role: p.role === "professor" ? "Professor(a)" : p.role,
      bio: null,
    })),
  });

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/agendamento/profissionais/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
