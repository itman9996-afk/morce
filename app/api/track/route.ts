import { NextResponse } from "next/server";
import { z } from "zod";
import {
  upsertVisitor,
  appendEvent,
  purgeIfConfigured,
} from "@/lib/visitor/server";

/**
 * POST /api/track — ثبت رویداد بازدیدکننده
 *  - محدودسازی نرخ: ۶۰ رویداد در دقیقه از هر IP
 *  - حذف رویداد تکراری (event_id تکراری در ۲۴ ساعت نادیده گرفته می‌شود)
 *  - تشخیص مرورگر/OS/دستگاه از User-Agent (بدون کتابخانه)
 *  - هیچ محتوای خصوصی جمع نمی‌شود؛ IP فقط از هدرهای سرور
 */

const WINDOW_MS = 60 * 1000;
const MAX_HITS = 60;
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

/** dedupe رویداد تکراری (retry شبکه و…) */
const seenEvents = new Map<string, number>();
function isDuplicateEvent(eventId: string): boolean {
  const now = Date.now();
  if (seenEvents.size > 3000) {
    for (const [k, t] of seenEvents) if (now - t > 24 * 60 * 60 * 1000) seenEvents.delete(k);
  }
  const prev = seenEvents.get(eventId);
  if (prev && now - prev < 24 * 60 * 60 * 1000) return true;
  seenEvents.set(eventId, now);
  return false;
}

const bodySchema = z.object({
  event_id: z.string().min(6).max(64),
  type: z.literal("page_view"),
  path: z.string().min(1).max(300),
  referrer: z.string().max(300).optional(),
  visitor_id: z.string().regex(/^[A-Za-z0-9_-]{6,48}$/),
  session_id: z.string().regex(/^[A-Za-z0-9_-]{6,48}$/),
  utm: z
    .object({
      utm_source: z.string().max(120).optional(),
      utm_medium: z.string().max(120).optional(),
      utm_campaign: z.string().max(120).optional(),
      utm_term: z.string().max(120).optional(),
      utm_content: z.string().max(120).optional(),
    })
    .optional(),
  screen: z.object({ w: z.number().int().min(0).max(20000), h: z.number().int().min(0).max(20000) }).optional(),
  language: z.string().max(35).optional(),
  timezone: z.string().max(64).optional(),
});

function parseUA(ua: string): {
  browser: string;
  browser_version: string;
  operating_system: string;
  device_type: string;
} {
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Version\/[\d.]+.*Safari\//.test(ua) ? "Safari" :
    /bot|crawler|spider/i.test(ua) ? "Bot" : "Other";

  const browser_version = ua.match(/(Edg|OPR|Firefox|Chrome|Version)\/([\d.]+)/)?.[2] ?? "";

  const operating_system =
    /Windows/.test(ua) ? "Windows" :
    /Android/.test(ua) ? "Android" :
    /iPhone|iPad|iPod/.test(ua) ? "iOS" :
    /Mac OS X/.test(ua) ? "macOS" :
    /Linux/.test(ua) ? "Linux" : "Other";

  const device_type =
    /iPad|Tablet/.test(ua) ? "tablet" :
    /Mobi|Android|iPhone/.test(ua) ? "mobile" : "desktop";

  return { browser, browser_version, operating_system, device_type };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";

  if (rateLimited(ip || "local")) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const data = parsed.data;
  if (isDuplicateEvent(data.event_id)) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  const ua = request.headers.get("user-agent") ?? "";
  const { browser, browser_version, operating_system, device_type } = parseUA(ua);
  const now = new Date().toISOString();

  try {
    await upsertVisitor({
      visitor_id: data.visitor_id,
      session_id: data.session_id,
      path: data.path,
      referrer: data.referrer,
      utm: data.utm,
      ip: ip || undefined,
      browser,
      browser_version,
      operating_system,
      device_type,
      screen_width: data.screen?.w,
      screen_height: data.screen?.h,
      language: data.language,
      timezone: data.timezone,
    });

    // رویداد بدون محتوای خصوصی — فقط فنی
    await appendEvent({
      event_id: data.event_id,
      type: data.type,
      visitor_id: data.visitor_id,
      session_id: data.session_id,
      timestamp: now,
      page: data.path,
      referrer: data.referrer ?? "",
      device_type,
    });

    // پاک‌سازی سیاست نگهداری — فقط در صورت تنظیم بودن env
    if (Math.random() < 0.02) {
      void purgeIfConfigured();
    }
  } catch (error) {
    console.error("[track] storage failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}