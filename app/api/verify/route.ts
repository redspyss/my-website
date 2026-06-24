import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sunucu tarafı şifre doğrulama.
// Şifre yalnızca environment variable içinde tutulur, frontend'e asla gönderilmez.
export async function POST(req: NextRequest) {
  let body: { password?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Büyü çözülemedi." },
      { status: 400 }
    );
  }

  const submitted =
    typeof body.password === "string" ? body.password.trim() : "";

  // Fallback yalnızca env tanımlı değilse devreye girer (lokal geliştirme kolaylığı).
  const expected = (process.env.SITE_PASSWORD ?? "21062025").trim();

  if (!submitted) {
    return NextResponse.json(
      { success: false, message: "Bu büyü sana ait görünmüyor." },
      { status: 401 }
    );
  }

  // Sabit zamanlı benzeri karşılaştırma
  const ok =
    submitted.length === expected.length &&
    timingSafeEqual(submitted, expected);

  if (ok) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { success: false, message: "Bu büyü sana ait görünmüyor." },
    { status: 401 }
  );
}

function timingSafeEqual(a: string, b: string): boolean {
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
