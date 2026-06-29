// Videoyu GitHub Releases'ten çekip aynı alan adı üzerinden doğru
// Content-Type (video/mp4) ve Range/seek desteğiyle sunar.
// Böylece iOS Safari dahil tüm mobil tarayıcılarda oynar; dosya birebir
// orijinal kalitede kalır (yeniden kodlama yok).

export const runtime = "edge";

const SRC =
  "https://github.com/redspyss/my-website/releases/download/media-v1/wegh-tuzak.mp4";

export async function GET(req: Request) {
  const range = req.headers.get("range");

  const upstreamHeaders: Record<string, string> = {};
  if (range) upstreamHeaders["Range"] = range;

  const upstream = await fetch(SRC, { headers: upstreamHeaders });

  const headers = new Headers();
  headers.set("Content-Type", "video/mp4");
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(upstream.body, {
    status: upstream.status, // 206 (range) veya 200 (tam)
    headers,
  });
}
