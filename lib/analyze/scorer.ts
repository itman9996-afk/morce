/**
 * Scorer — امتیازدهی قاعده‌محور از داده‌ی واقعی واکشی‌شده
 * هر امتیاز یک دلیل دارد (evidence) — هیچ عددی بدون منبع نیست.
 */
import type { FetchResult } from "./fetcher";

export interface ScoreItem {
  label: string;
  score: number;      // ۰ تا ۱۰۰
  max: number;
  status: "OBSERVED" | "VERIFIED" | "NOT FOUND";
  evidence: string;
}

export interface SiteScores {
  seo: ScoreItem[];
  seo_total: number;
  ux: ScoreItem[];
  ux_total: number;
  trust: ScoreItem[];
  trust_total: number;
}

export function scoreSite(f: FetchResult): SiteScores {
  const pct = (got: number, max: number) => Math.round((got / max) * 100);

  /* ---------- SEO ---------- */
  const seo: ScoreItem[] = [];
  seo.push(
    f.title
      ? { label: "عنوان صفحه (Title)", score: f.title.length >= 15 && f.title.length <= 65 ? 100 : 65, max: 100, status: "OBSERVED", evidence: `«${f.title}» (${f.title.length} نویسه)` }
      : { label: "عنوان صفحه (Title)", score: 0, max: 100, status: "NOT FOUND", evidence: "تگ title یافت نشد" }
  );
  seo.push(
    f.meta_description
      ? { label: "توضیحات متا", score: f.meta_description.length >= 50 ? 100 : 60, max: 100, status: "OBSERVED", evidence: `${f.meta_description.length} نویسه` }
      : { label: "توضیحات متا", score: 0, max: 100, status: "NOT FOUND", evidence: "meta description وجود ندارد" }
  );
  seo.push(
    f.h1s.length === 1
      ? { label: "ساختار H1", score: 100, max: 100, status: "OBSERVED", evidence: "دقیقاً یک H1 — صحیح" }
      : { label: "ساختار H1", score: f.h1s.length === 0 ? 0 : 50, max: 100, status: "OBSERVED", evidence: f.h1s.length === 0 ? "هیچ H1 یافت نشد" : `${f.h1s.length} عدد H1 (بهتر است یکی باشد)` }
  );
  seo.push({
    label: "Open Graph (اشتراک‌گذاری اجتماعی)",
    score: (f.og_title ? 50 : 0) + (f.og_description ? 30 : 0) + (f.og_image ? 20 : 0),
    max: 100,
    status: f.og_title || f.og_description ? "OBSERVED" : "NOT FOUND",
    evidence: `${f.og_title ? "og:title ✓" : "og:title ✗"} / ${f.og_description ? "og:description ✓" : "og:description ✗"} / ${f.og_image ? "og:image ✓" : "og:image ✗"}`,
  });
  seo.push({
    label: "متادیتای موبایل (viewport)",
    score: f.has_viewport_meta ? 100 : 0,
    max: 100,
    status: "OBSERVED",
    evidence: f.has_viewport_meta ? "viewport تعریف شده" : "viewport یافت نشد — احتمال مشکل نمایش در موبایل",
  });
  seo.push({
    label: "متن جایگزین تصاویر (alt)",
    score: f.image_count === 0 ? 50 : pct(f.image_count - f.image_without_alt, f.image_count),
    max: 100,
    status: "OBSERVED",
    evidence: f.image_count === 0 ? "تصویری در صفحه اصلی نیست" : `${f.image_count - f.image_without_alt} از ${f.image_count} تصویر alt دارند`,
  });

  /* ---------- UX ---------- */
  const ux: ScoreItem[] = [];
  ux.push({
    label: "سرعت پاسخ سرور",
    score: f.load_ms < 800 ? 100 : f.load_ms < 2000 ? 75 : f.load_ms < 5000 ? 45 : 15,
    max: 100,
    status: "VERIFIED",
    evidence: `${(f.load_ms / 1000).toFixed(1)} ثانیه تا دریافت HTML`,
  });
  ux.push({
    label: "حجم صفحه‌ی اصلی",
    score: f.size_kb < 120 ? 100 : f.size_kb < 350 ? 75 : f.size_kb < 700 ? 50 : 25,
    max: 100,
    status: "VERIFIED",
    evidence: `${f.size_kb} کیلوبایت HTML`,
  });
  ux.push({
    label: "امنیت SSL",
    score: f.ssl ? 100 : 0,
    max: 100,
    status: "VERIFIED",
    evidence: f.ssl ? "HTTPS فعال" : "HTTPS فعال نیست — مرورگرها هشدار می‌دهند",
  });
  ux.push({
    label: "فرم ثبت/تماس در صفحه",
    score: f.has_form ? 100 : 40,
    max: 100,
    status: "OBSERVED",
    evidence: f.has_form ? "فرم HTML یافت شد" : "فرمی در صفحه‌ی اصلی دیده نشد",
  });
  ux.push({
    label: "راه تماس سریع",
    score: (f.has_tel_link ? 60 : 0) + (f.has_whatsapp ? 40 : 0),
    max: 100,
    status: "OBSERVED",
    evidence: `${f.has_tel_link ? "لینک tel ✓" : "لینک tel ✗"} / ${f.has_whatsapp ? "واتساپ ✓" : "واتساپ ✗"}`,
  });

  /* ---------- اعتماد و CTA ---------- */
  const trust: ScoreItem[] = [];
  trust.push({
    label: "کلمات فراخوان اقدام (CTA)",
    score: Math.min(100, f.cta_keywords.length * 25),
    max: 100,
    status: "OBSERVED",
    evidence: f.cta_keywords.length ? `یافت‌شده: ${f.cta_keywords.join("، ")}` : "هیچ CTA مشخصی در متن یافت نشد",
  });
  trust.push({
    label: "نشانه‌های اعتماد",
    score: Math.min(100, f.trust_keywords.length * 20),
    max: 100,
    status: "OBSERVED",
    evidence: f.trust_keywords.length ? `یافت‌شده: ${f.trust_keywords.join("، ")}` : "نشانه‌ی اعتماد صریحی در متن یافت نشد",
  });

  const avg = (items: ScoreItem[]) => Math.round(items.reduce((s, i) => s + i.score, 0) / items.length);
  return { seo, seo_total: avg(seo), ux, ux_total: avg(ux), trust, trust_total: avg(trust) };
}