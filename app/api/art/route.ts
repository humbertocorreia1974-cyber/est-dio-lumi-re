import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Artwork = {
  id: number;
  title: string;
  image_id: string | null;
  artist_title: string | null;
  date_display: string | null;
};

export async function GET() {
  try {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(
      'https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,artist_title,date_display&limit=6&page=1',
      { signal: controller.signal, next: { revalidate: 3600 } }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ items: [], error: 'A galeria de inspiração está indisponível agora.' }, { status: 200 });
    }

    const json = (await res.json()) as { data?: Artwork[] };
    const items = (json.data ?? [])
      .filter((a) => Boolean(a.image_id))
      .map((a) => ({
        id: a.id,
        title: a.title,
        artist: a.artist_title ?? 'Autor não identificado',
        date: a.date_display ?? '',
        image: `/hero.svg`,
      }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [], error: 'Não foi possível carregar a galeria agora.' }, { status: 200 });
  }

  } catch (__jgnextApiErrorReportErr: any) {
    // __jgnextApiErrorReport — reparo automático de runtime (ver runtimeErrorGate.js)
    try {
      const { reportRuntimeError } = await import('@/lib/runtime-error-reporter');
      await reportRuntimeError({
        type: 'server',
        file: "app/api/art/route.ts",
        message: __jgnextApiErrorReportErr?.message || String(__jgnextApiErrorReportErr),
        stack: __jgnextApiErrorReportErr?.stack,
      });
    } catch (__jgnextApiErrorReportReportErr) { /* relatar erro nunca pode gerar outro erro */ }
    throw __jgnextApiErrorReportErr;
  }
}
