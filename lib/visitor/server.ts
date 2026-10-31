/**
 * ذخیره‌سازی سمت سرور Visitor Intelligence — بدون هیچ وابستگی
 *
 *  - .leads/visitors.json        ← رکورد خلاصه‌ی هر بازدیدکننده (upsert با visitor_id)
 *  - .leads/visitor-events.jsonl ← رویدادها (append-only، یک خط JSON هر رویداد)
 *  - فایل‌ها هرگز در public نیستند؛ دسترسی فقط از صفحه/API ادمین با ADMIN_KEY
 *
 *  برای مقیاس چند-هزار نفره: مهاجرت به SQLite — ساختار تابع‌ها طوری است که
 *  فقط پیاده‌سازی همین فایل عوض می‌شود، نه APIها.
 */
import { mkdir, readFile, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".leads");
const VISITORS_FILE = path.join(DATA_DIR, "visitors.json");
const EVENTS_FILE = path.join(DATA_DIR, "visitor-events.jsonl");

export interface VisitorRecord {
  visitor_id: string;
  created_at: string;
  updated_at: string;
  sessions: string[];
  visit_count: number;
  first_page: string;
  last_page: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ip_address?: string;
  browser?: string;
  browser_version?: string;
  operating_system?: string;
  device_type?: string;
  screen_width?: number;
  screen_height?: number;
  language?: string;
  timezone?: string;
  lead_status: "visitor" | "lead";
}

export interface LeadRow {
  name: string;
  phone: string;
  business?: string;
  message?: string;
  services?: string[];
  source: "chat" | "form";
  visitor_id?: string;
  session_id?: string;
  consent_timestamp: string;
  createdAt: string;
}

async function ensureDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

/* ---------------------- بازدیدکننده‌ها ---------------------- */

export async function readVisitors(): Promise<Record<string, VisitorRecord>> {
  try {
    const raw = await readFile(VISITORS_FILE, "utf8");
    return JSON.parse(raw) as Record<string, VisitorRecord>;
  } catch {
    return {};
  }
}

export async function upsertVisitor(input: {
  visitor_id: string;
  session_id: string;
  path: string;
  referrer?: string;
  utm?: Record<string, string | undefined>;
  ip?: string;
  browser?: string;
  browser_version?: string;
  operating_system?: string;
  device_type?: string;
  screen_width?: number;
  screen_height?: number;
  language?: string;
  timezone?: string;
}): Promise<void> {
  await ensureDir();
  const all = await readVisitors();
  const now = new Date().toISOString();
  const existing = all[input.visitor_id];

  if (!existing) {
    all[input.visitor_id] = {
      visitor_id: input.visitor_id,
      created_at: now,
      updated_at: now,
      sessions: [input.session_id],
      visit_count: 1,
      first_page: input.path,
      last_page: input.path,
      referrer: input.referrer,
      utm_source: input.utm?.utm_source,
      utm_medium: input.utm?.utm_medium,
      utm_campaign: input.utm?.utm_campaign,
      utm_term: input.utm?.utm_term,
      utm_content: input.utm?.utm_content,
      ip_address: input.ip,
      browser: input.browser,
      browser_version: input.browser_version,
      operating_system: input.operating_system,
      device_type: input.device_type,
      screen_width: input.screen_width,
      screen_height: input.screen_height,
      language: input.language,
      timezone: input.timezone,
      lead_status: "visitor",
    };
  } else {
    if (!existing.sessions.includes(input.session_id)) {
      existing.sessions.push(input.session_id);
      existing.visit_count = (existing.visit_count ?? 0) + 1;
    }
    existing.last_page = input.path;
    existing.updated_at = now;
    existing.ip_address = input.ip ?? existing.ip_address;
    existing.browser = input.browser ?? existing.browser;
    existing.operating_system = input.operating_system ?? existing.operating_system;
    existing.device_type = input.device_type ?? existing.device_type;
    existing.screen_width = input.screen_width ?? existing.screen_width;
    existing.screen_height = input.screen_height ?? existing.screen_height;
    if (input.referrer && !existing.referrer) existing.referrer = input.referrer;
    // UTM اولین منبع ورود می‌ماند — بازنویسی نمی‌شود
  }

  await writeFile(VISITORS_FILE, JSON.stringify(all, null, 0), "utf8");
}

/** وقتی بازدیدکننده لید شد — از مسیر چت‌بات صدا زده می‌شود */
export async function markVisitorAsLead(visitorId?: string): Promise<void> {
  if (!visitorId) return;
  try {
    const all = await readVisitors();
    const v = all[visitorId];
    if (v) {
      v.lead_status = "lead";
      await writeFile(VISITORS_FILE, JSON.stringify(all, null, 0), "utf8");
    }
  } catch {
    /* عدم موفقیت در به‌روزرسانی، ثبت لید را رد نمی‌کند */
  }
}

/* ---------------------- رویدادها ---------------------- */

export async function appendEvent(event: Record<string, unknown>): Promise<void> {
  await ensureDir();
  await appendFile(EVENTS_FILE, JSON.stringify(event) + "\n", "utf8");
}

export async function countEvents(): Promise<number> {
  try {
    const raw = await readFile(EVENTS_FILE, "utf8");
    return raw.split("\n").filter(Boolean).length;
  } catch {
    return 0;
  }
}

/** حذف بر اساس سیاست نگهداری — فقط اگر VISITOR_DATA_RETENTION_DAYS تنظیم شده باشد */
export async function purgeIfConfigured(): Promise<void> {
  const days = Number(process.env.VISITOR_DATA_RETENTION_DAYS ?? "");
  if (!Number.isFinite(days) || days <= 0) return;
  try {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const all = await readVisitors();
    let changed = false;
    for (const [id, v] of Object.entries(all)) {
      if (new Date(v.updated_at).getTime() < cutoff) {
        delete all[id];
        changed = true;
      }
    }
    if (changed) {
      await ensureDir();
      await writeFile(VISITORS_FILE, JSON.stringify(all, null, 0), "utf8");
    }
  } catch {
    /* بی‌صدا — حذف هرگز نباید مسیر اصلی را بشکند */
  }
}

/* ---------------------- لیدها (چت + فرم) ---------------------- */

interface RawLeadLine {
  name: string;
  phone: string;
  business?: string;
  message?: string;
  problem?: string;
  services?: string[];
  visitorId?: string;
  sessionId?: string;
  consent_timestamp?: string;
  createdAt?: string;
}

function normalizeLead(raw: RawLeadLine, source: "chat" | "form"): LeadRow {
  return {
    name: raw.name,
    phone: raw.phone,
    business: raw.business,
    message: raw.message ?? raw.problem,
    services: raw.services,
    source,
    visitor_id: raw.visitorId,
    session_id: raw.sessionId,
    consent_timestamp: raw.consent_timestamp ?? raw.createdAt ?? "",
    createdAt: raw.createdAt ?? raw.consent_timestamp ?? "",
  };
}

export async function listLeads(): Promise<LeadRow[]> {
  const { readFile: rf } = await import("node:fs/promises");
  const chatFile = path.join(DATA_DIR, "chat-leads.json");
  const formFile = path.join(DATA_DIR, "leads.json");
  const leads: LeadRow[] = [];

  for (const [file, source] of [
    [chatFile, "chat"],
    [formFile, "form"],
  ] as const) {
    try {
      const raw = await rf(file, "utf8");
      for (const line of raw.split("\n")) {
        if (!line.trim()) continue;
        try {
          leads.push(normalizeLead(JSON.parse(line) as RawLeadLine, source));
        } catch {
          /* خط خراب → نادیده گرفته می‌شود */
        }
      }
    } catch {
      /* فایل نبود → این منبع خالی است */
    }
  }

  return leads.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

/* ---------------------- خروجی CSV (Excel) ---------------------- */

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export function leadsToCsv(leads: LeadRow[]): string {
  const headers = [
    "name", "phone", "business", "message", "services", "source",
    "visitor_id", "session_id", "consent_timestamp", "created_at",
  ];
  const rows = leads.map((l) =>
    [
      l.name, l.phone, l.business ?? "", l.message ?? "",
      (l.services ?? []).join(" | "), l.source,
      l.visitor_id ?? "", l.session_id ?? "",
      l.consent_timestamp, l.createdAt,
    ].map(csvCell).join(",")
  );
  return "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
}

export function visitorsToCsv(visitors: Record<string, VisitorRecord>): string {
  const headers = [
    "visitor_id", "created_at", "updated_at", "visit_count", "lead_status",
    "ip_address", "browser", "browser_version", "operating_system", "device_type",
    "screen_width", "screen_height", "language", "timezone",
    "first_page", "last_page", "referrer",
    "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  ];
  const rows = Object.values(visitors).map((v) =>
    [
      v.visitor_id, v.created_at, v.updated_at, v.visit_count, v.lead_status,
      v.ip_address ?? "", v.browser ?? "", v.browser_version ?? "",
      v.operating_system ?? "", v.device_type ?? "",
      v.screen_width ?? "", v.screen_height ?? "",
      v.language ?? "", v.timezone ?? "",
      v.first_page, v.last_page, v.referrer ?? "",
      v.utm_source ?? "", v.utm_medium ?? "", v.utm_campaign ?? "",
      v.utm_term ?? "", v.utm_content ?? "",
    ].map(csvCell).join(",")
  );
  return "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
}