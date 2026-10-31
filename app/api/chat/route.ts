import { NextResponse } from "next/server";
import { z } from "zod";
import { getProvider, GRACEFUL_FALLBACK } from "@/lib/chat/provider";

/**
 * API چت — فقط سمت سرور؛ Provider و کلیدها هرگز به مرورگر نمی‌روند.
 * محدودسازی نرخ: ۲۰ پیام در ۵ دقیقه از هر IP.
 * محتوای مکالمه در لاگ نوشته نمی‌شود (فقط وضعیت فنی).
 */

const WINDOW_MS = 5 * 60 * 1000;
const MAX_HITS = 20;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  }
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_HITS;
}

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(16),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { reply: "پیام‌ها زیاد بود؛ لطفاً چند دقیقه بعد دوباره تلاش کن. 🙏" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: GRACEFUL_FALLBACK }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ reply: GRACEFUL_FALLBACK }, { status: 400 });
  }

  try {
    const provider = getProvider();
    const reply = await provider.reply(parsed.data.messages);
    return NextResponse.json({ reply, provider: provider.name });
  } catch (error) {
    // خطای فنی Provider → پاسخ محترمانه؛ کاربر متوجه خطای سرور نمی‌شود
    console.error("[chat] provider failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ reply: GRACEFUL_FALLBACK });
  }
}