import illustrations from "@/lib/data/ecg-module-illustrations.json";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ image: string }> },
) {
  const { image } = await params;
  const index = Number(image);
  if (!Number.isInteger(index) || index < 0 || index >= illustrations.length) {
    return new Response("Tidak ditemukan", { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(illustrations[index].src, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return new Response("Gambar tidak tersedia", { status: 502 });
  }
  if (!upstream.ok || !upstream.body) return new Response("Gambar tidak tersedia", { status: 502 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow, noarchive, noimageindex, noai, noimageai",
    },
  });
}
