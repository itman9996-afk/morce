/**
 * Fetcher — ابزار تعیین‌کننده (Tool) برای واکشی و پارس عمومی وب‌سایت
 *  - فقط صفحات عمومی، بدون دور زدن هرگونه محدودیت
 *  - robots.txt خوانده و ذخیره می‌شود؛ اگر fetch مسیر ریشه ممنوع بود، واکشی انجام نمی‌شود
 *  - هیچ محتوای خصوصی/شخصی جمع نمی‌شود — فقط سیگنال‌های ساختاری صفحه
 */

export interface FetchResult {
  ok: boolean;
  status: number;
  final_url: string;
  ssl: boolean;
  load_ms: number;
  size_kb: number;
  title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  h1s: string[];
  h2s: string[];
  has_viewport_meta: boolean;
  has_form: boolean;
  has_tel_link: boolean;
  has_whatsapp: boolean;
  cta_keywords: string[];
  trust_keywords: string[];
  image_count: number;
  image_without_alt: number;
  script_count: number;
  robots_txt?: string;
  robots_allows_root?: boolean;
  not_found_reason?: string;
}

const TIMEOUT_MS = 12_000;
const MAX_BYTES = 900_000;

function countKeywords(html: string, words: string[]): string[] {
  const lower = html.toLowerCase();
  return words.filter((w) => lower.includes(w));
}

const CTA_WORDS = ["درخواست مشاوره", "تماس بگیر", "همین حالا", "ثبت سفارش", "مشاوره رایگان", "contact", "call to action", "درخواست همکاری", "دریافت قیمت"];
const TRUST_WORDS = ["نماد اعتماد", "اینماد", "تستimonials", "نظرات مشتریان", "پشتیبانی ۲۴", "گارانتی", "ضمانت", "سابقه", "نمونه کار", "مشتریان ما", "about"];

export async function fetchAndParse(rawUrl: string): Promise<FetchResult> {
  const started = Date.now();

  const base: FetchResult = {
    ok: false,
    status: 0,
    final_url: rawUrl,
    ssl: rawUrl.startsWith("https"),
    load_ms: 0,
    size_kb: 0,
    h1s: [],
    h2s: [],
    has_viewport_meta: false,
    has_form: false,
    has_tel_link: false,
    has_whatsapp: false,
    cta_keywords: [],
    trust_keywords: [],
    image_count: 0,
    image_without_alt: 0,
    script_count: 0,
  };

  /* URL نرمال — بدون پروتکل، https امتحان می‌شود و سپس http */
  let url: URL;
  try {
    url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
  } catch {
    return { ...base, not_found_reason: "URL نامعتبر است" };
  }

  /* robots.txt — احترام به قوانین سایت */
  let robots_allows_root = true;
  let robots_txt: string | undefined;
  try {
    const robotsRes = await fetch(new URL("/robots.txt", url.origin).toString(), {
      signal: AbortSignal.timeout(6000),
      redirect: "follow",
    });
    if (robotsRes.ok) {
      robots_txt = (await robotsRes.text()).slice(0, 4000);
      robots_allows_root = !/Disallow:\s*\/\s*$/im.test(robots_txt);
    }
  } catch {
    /* robots نبود = مجاز به‌صورت پیش‌فرض */
  }
  if (!robots_allows_root) {
    return { ...base, robots_txt, robots_allows_root, not_found_reason: "robots.txt کل سایت را بسته است — به قوانین سایت احترام می‌گذاریم و واکشی انجام نشد" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "AbbasSiteAnalyzer/1.0 (business analysis; contact via site form)",
        Accept: "text/html",
      },
    });
    clearTimeout(timer);
    const html = (await res.text()).slice(0, MAX_BYTES);
    const load_ms = Date.now() - started;

    const meta = (prop: string) =>
      html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${prop}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ??
      html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${prop}["']`, "i"))?.[1];

    const h1s = Array.from(html.matchAll(/<h1[^>]*>([\s\S]{0,200}?)<\/h1>/gi))
      .map((m) => m[1].replace(/<[^>]*>/g, "").trim())
      .filter(Boolean)
      .slice(0, 5);
    const h2s = Array.from(html.matchAll(/<h2[^>]*>([\s\S]{0,200}?)<\/h2>/gi))
      .map((m) => m[1].replace(/<[^>]*>/g, "").trim())
      .filter(Boolean)
      .slice(0, 10);

    const images = html.match(/<img\b/gi)?.length ?? 0;
    const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/gi)?.length ?? 0);

    return {
      ok: res.ok && /text\/html/i.test(res.headers.get("content-type") ?? "text/html"),
      status: res.status,
      final_url: res.url || url.toString(),
      ssl: (res.url || url.toString()).startsWith("https"),
      load_ms,
      size_kb: Math.round(html.length / 1024),
      title: html.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i)?.[1]?.trim(),
      meta_description: meta("description"),
      og_title: meta("og:title"),
      og_description: meta("og:description"),
      og_image: meta("og:image"),
      h1s,
      h2s,
      has_viewport_meta: /<meta[^>]+name=["']viewport["']/i.test(html),
      has_form: /<form\b/i.test(html),
      has_tel_link: /href=["']tel:/i.test(html),
      has_whatsapp: /wa\.me|whatsapp/i.test(html),
      cta_keywords: countKeywords(html, CTA_WORDS),
      trust_keywords: countKeywords(html, TRUST_WORDS),
      image_count: images,
      image_without_alt: imgsNoAlt,
      script_count: html.match(/<script\b/gi)?.length ?? 0,
      robots_txt,
      robots_allows_root,
    };
  } catch (error) {
    clearTimeout(timer);
    return {
      ...base,
      robots_txt,
      robots_allows_root,
      not_found_reason:
        error instanceof Error && error.name === "TimeoutError"
          ? "پاسخ سایت بیش از ۱۲ ثانیه طول کشید"
          : "سایت در دسترس نبود یا آدرس نادرست است",
    };
  }
}