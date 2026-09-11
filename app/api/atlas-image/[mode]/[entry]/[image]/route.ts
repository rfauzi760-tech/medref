import { getAtlasSourceImage, type AtlasMode } from "@/lib/data/atlas-images";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mode: string; entry: string; image: string }> },
) {
  const { mode, entry, image } = await params;
  if (mode !== "ecg" && mode !== "radiology") return new Response("Tidak ditemukan", { status: 404 });

  const entryIndex = Number(entry);
  const imageIndex = Number(image);
  if (!Number.isInteger(entryIndex) || !Number.isInteger(imageIndex) || entryIndex < 0 || imageIndex < 0) {
    return new Response("Tidak ditemukan", { status: 404 });
  }

  const source = getAtlasSourceImage(mode as AtlasMode, entryIndex, imageIndex);
  if (!source) return new Response("Tidak ditemukan", { status: 404 });

  let upstream: Response;
  try {
    upstream = await fetch(source.src, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
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
