import { NextResponse } from "next/server";
import { z } from "zod";
import { createJob, getJob } from "@/lib/analyze/engine";

/**
 * POST /api/analyze — شروع تحلیل
 * GET  /api/analyze?id=... — وضعیت واقعی مراحل + نتیجه
 *  - سقف: ۳ تحلیل جدید در ۱۰ دقیقه از هر IP (تحلیل هزینه‌بر است)
 *  - کش ۶ ساعته برای درخواست تکراری همان کسب‌وکار
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 3;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_HITS;
}

const inputSchema = z.object({
  business: z.string().trim().min(2).max(120),
  industry: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  website: z.string().trim().max(300).optional(),
  social: z.string().trim().max(300).optional(),
  goal: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "درخواست‌های تحلیل زیاد است؛ کمی بعد دوباره تلاش کن." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "درخواست نامعتبر است." }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "نام کسب‌وکار لازم است (حداقل ۲ نویسه).", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // فقط فیلدهای اسکیمای موجود — هیچ فیلد اضافه‌ای از کاربر پذیرفته نمی‌شود
  const { id, cached } = createJob(parsed.data);
  return NextResponse.json({ ok: true, id, cached }, { status: 201 });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const job = getJob(id);
  if (!job) {
    return NextResponse.json({ ok: false, message: "تحلیل یافت نشد." }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    state: job.state,
    steps: job.steps,
    result: job.result ?? null,
    error: job.error ?? null,
  });
}