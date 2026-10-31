import { NextResponse } from "next/server";
import { z } from "zod";
import { markVisitorAsLead } from "@/lib/visitor/server";

/**
 * ثبت لید از داخل چت — مبتنی بر رضایت صریح
 *  - consent باید دقیقاً true باشد
 *  - ذخیره در .leads/chat-leads.json (غیرعمومی)
 *  - فوروارد اختیاری به n8n با LEAD_WEBHOOK_URL (+ LEAD_WEBHOOK_TOKEN)
 *  - جدید: visitorId/sessionId ذخیره و رکورد بازدیدکننده «لید» علامت می‌خورد
 *  - محدودسازی نرخ: ۳ ثبت در ۱۰ دقیقه از هر IP
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

const leadSchema = z.object({
  name: z.string().trim().min(2, "نام کوتاه است").max(80),
  phone: z.string().trim().regex(/^(?:\+98|0)9\d{9}$/, "شماره موبایل نامعتبر است"),
  business: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  consent: z.literal(true),
  visitorId: z.string().max(48).optional(),
  sessionId: z.string().max(48).optional(),
});

interface LeadRecord {
  name: string;
  phone: string;
  business?: string;
  message?: string;
  consent_status: "granted";
  consent_timestamp: string;
  visitorId?: string;
  sessionId?: string;
  source: "website-chatbot";
  createdAt: string;
}

async function saveLocal(lead: LeadRecord): Promise<void> {
  try {
    const { mkdir, appendFile } = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), ".leads");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "chat-leads.json"), JSON.stringify(lead) + "\n", "utf8");
  } catch (error) {
    console.error("[chat-lead] local save failed:", error instanceof Error ? error.message : error);
  }
}

async function forwardWebhook(lead: LeadRecord): Promise<void> {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) return;
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
    if (!res.ok) console.error("[chat-lead] webhook failed:", res.status);
  } catch (error) {
    console.error("[chat-lead] webhook error:", error instanceof Error ? error.message : error);
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "درخواست‌ها زیاد است؛ کمی بعد دوباره تلاش کن." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "درخواست نامعتبر است." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "اطلاعات واردشده کامل یا معتبر نیست.", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const rawPhone = parsed.data.phone;
  const phone = rawPhone.startsWith("+98") ? `0${rawPhone.slice(3)}` : rawPhone;

  const lead: LeadRecord = {
    name: parsed.data.name,
    phone,
    business: parsed.data.business || undefined,
    message: parsed.data.message || undefined,
    consent_status: "granted",
    consent_timestamp: new Date().toISOString(),
    visitorId: parsed.data.visitorId,
    sessionId: parsed.data.sessionId,
    source: "website-chatbot",
    createdAt: new Date().toISOString(),
  };

  await saveLocal(lead);
  await forwardWebhook(lead);
  await markVisitorAsLead(lead.visitorId);

  return NextResponse.json({ ok: true, message: "درخواست شما ثبت شد." }, { status: 201 });
}