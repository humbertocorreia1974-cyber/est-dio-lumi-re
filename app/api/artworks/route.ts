export const dynamic = 'force-dynamic';

export async function GET() {
  try {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      'https://api.artic.edu/api/v1/artworks?limit=6&fields=id,title,image_id,artist_title',
      { signal: controller.signal, next: { revalidate: 3600 } }
    );
    clearTimeout(timeout);
    if (!res.ok) {
      return Response.json({ error: 'Acervo indisponível no momento.' }, { status: 502 });
    }
    const json = await res.json();
    return Response.json({ data: json?.data ?? [] });
  } catch {
    return Response.json({ error: 'Não foi possível carregar o acervo. Tente novamente.' }, { status: 504 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/artworks/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
