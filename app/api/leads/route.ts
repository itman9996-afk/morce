import { NextResponse } from "next/server";
import { consultationSchema } from "@/data/content";

/**
 * لایه‌ی یکپارچه‌سازی لیدها + امنیت:
 *  - اعتبارسنجی کامل ورودی با Zod (سمت سرور)
 *  - محدودسازی نرخ ارسال: حداکثر ۵ درخواست در هر ۱۰ دقیقه از هر IP
 *  - اتصال آماده به n8n/Webhook با LEAD_WEBHOOK_URL (+ LEAD_WEBHOOK_TOKEN)
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // پاک‌سازی دوره‌ای ورودی‌های منقضی
  if (hits.size > 500) {
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

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "local";
}

interface LeadPayload {
  name: string;
  phone: string;
  business: string;
  field?: string;
  website?: string;
  problem: string;
  services?: string[];
  createdAt: string;
  source: string;
}

async function submitLead(lead: LeadPayload): Promise<{ ok: boolean }> {
  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_WEBHOOK_TOKEN
            ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
            : {}),
        },
        body: JSON.stringify(lead),
      });
      if (!res.ok) {
        console.error("[leads] webhook failed", res.status);
        return { ok: false };
      }
      return { ok: true };
    } catch (error) {
      console.error("[leads] webhook error", error);
      return { ok: false };
    }
  }

  console.info("[leads:new]", JSON.stringify(lead));
  return { ok: true };
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "تعداد درخواست‌های شما زیاد است؛ لطفاً چند دقیقه بعد دوباره تلاش کنید." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "درخواست نامعتبر است." },
      { status: 400 }
    );
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "اطلاعات ارسالی معتبر نیست.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const lead: LeadPayload = {
    ...parsed.data,
    field: parsed.data.field || undefined,
    website: parsed.data.website || undefined,
    services: parsed.data.services?.length ? parsed.data.services : undefined,
    createdAt: new Date().toISOString(),
    source: "website-consultation-form",
  };

  const result = await submitLead(lead);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "ثبت درخواست با خطا مواجه شد. لطفاً بعداً تلاش کنید." },
      { status: 502 }
    );
  }

  return NextResponse.json(
    { ok: true, message: "درخواست شما ثبت شد." },
    { status: 201 }
  );
}