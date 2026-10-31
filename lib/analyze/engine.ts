/**
 * Engine — هماهنگ‌کننده‌ی مراحل تحلیل (Agent orchestration)
 *
 *  مراحل واقعی: شناسایی → واکشی سایت → امتیازدهی → تحلیل استراتژی (AI اختیاری) → گزارش
 *  - State machine با state صریح
 *  - کش ۶ ساعته بر اساس URL+نام (کاهش درخواست تکراری)
 *  - سقف بودجه: یک fetch (واقعی) به‌ازای هر تحلیل — بدون زنجیره‌ی خزنده
 *  - گزارش: اگر CHAT_API_* پیکربندی باشد از مدل سازگار-OpenAI استفاده می‌شود؛
 *    وگرنه موتور قاعده‌محور از همان داده‌های واکشی‌شده گزارش می‌سازد.
 *  - هرگز داده از خودش نمی‌سازد: نبودِ داده = NOT FOUND / NOT VERIFIED
 */
import { fetchAndParse, type FetchResult } from "./fetcher";
import { scoreSite, type SiteScores } from "./scorer";

export type AnalyzeState =
  | "DISCOVERY"
  | "RESEARCHING"
  | "VERIFYING"
  | "ANALYZING"
  | "STRATEGIZING"
  | "GENERATING_REPORT"
  | "COMPLETED"
  | "FAILED";

export interface AnalyzeInput {
  business: string;
  industry?: string;
  location?: string;
  website?: string;
  social?: string;
  goal?: string;
}

export interface AnalyzeResult {
  business: string;
  industry: string;
  location: string;
  website: string;
  social: string;
  goal: string;
  website_analysis: {
    fetched: boolean;
    note: string;
    data: FetchResult | null;
    scores: SiteScores | null;
  };
  market_analysis: { positioning: string; signals: string[]; confidence: "HIGH" | "MEDIUM" | "LOW" };
  competitor_note: string;
  ai_opportunities: string[];
  strengths: string[];
  weaknesses: string[];
  quick_wins: Array<{ action: string; impact: string; effort: string; priority: "بالا" | "متوسط" }>;
  plan_30_days: Array<{ week: string; tasks: string[] }>;
  strategy_note: string;
  generated_by: "ai-model" | "rules-engine";
  created_at: string;
}

interface Job {
  id: string;
  state: AnalyzeState;
  steps: Array<{ id: string; label: string; done: boolean }>;
  input: AnalyzeInput;
  result?: AnalyzeResult;
  error?: string;
  startedAt: number;
}

/* ---------- نگهداری state در حافظه‌ی سرور (تک-سرور) ---------- */
const jobs = new Map<string, Job>();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map<string, { result: AnalyzeResult; at: number }>();

export function createJob(input: AnalyzeInput): { id: string; cached: boolean } {
  const cacheKey = `${(input.website ?? "").toLowerCase().replace(/\/+$/, "")}|${input.business.trim()}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    const id = `job_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    jobs.set(id, {
      id,
      state: "COMPLETED",
      steps: STEPS.map((s) => ({ ...s, done: true })),
      input,
      result: hit.result,
      startedAt: Date.now(),
    });
    return { id, cached: true };
  }

  const id = `job_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const job: Job = {
    id,
    state: "DISCOVERY",
    steps: STEPS.map((s) => ({ ...s, done: false })),
    input,
    startedAt: Date.now(),
  };
  jobs.set(id, job);

  // اجرای غیرهمگام — کلاینت status را poll می‌کند
  void runJob(job).catch((e) => {
    job.state = "FAILED";
    job.error = e instanceof Error ? e.message : "خطای ناشناخته";
  });

  return { id, cached: false };
}

const STEPS = [
  { id: "identify", label: "شناسایی کسب‌وکار" },
  { id: "fetch", label: "بررسی وب‌سایت" },
  { id: "score", label: "امتیازدهی و اثبات‌ها" },
  { id: "strategy", label: "تولید استراتژی" },
  { id: "report", label: "ساخت گزارش" },
];

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

function stepDone(job: Job, id: string) {
  const s = job.steps.find((x) => x.id === id);
  if (s) s.done = true;
}

async function runJob(job: Job): Promise<void> {
  const input = job.input;

  /* ۱) شناسایی */
  job.state = "DISCOVERY";
  stepDone(job, "identify");

  /* ۲) واکشی واقعی وب‌سایت (اگر داده شده) */
  job.state = "RESEARCHING";
  let fetched: FetchResult | null = null;
  if (input.website) {
    fetched = await fetchAndParse(input.website);
  }
  stepDone(job, "fetch");

  /* ۳) امتیازدهی */
  job.state = "VERIFYING";
  const scores = fetched?.ok ? scoreSite(fetched) : null;
  stepDone(job, "score");

  /* ۴) استراتژی — AI اختیاری، وگرنه قاعده‌محور */
  job.state = "STRATEGIZING";
  const aiReport = await tryAiReport(input, fetched, scores);
  const report = buildReport(input, fetched, scores, aiReport);
  stepDone(job, "strategy");

  /* ۵) گزارش نهایی */
  job.state = "GENERATING_REPORT";
  job.result = report;
  cache.set(`${(input.website ?? "").toLowerCase().replace(/\/+$/, "")}|${input.business.trim()}`, {
    result: report,
    at: Date.now(),
  });
  job.state = "COMPLETED";
  stepDone(job, "report");

  // پاک‌سازی حافظه‌ی jobهای قدیمی (بیش از ۵۰ عدد)
  if (jobs.size > 50) {
    const oldest = [...jobs.entries()].sort((a, b) => a[1].startedAt - b[1].startedAt).slice(0, jobs.size - 50);
    for (const [k] of oldest) jobs.delete(k);
  }
}

/* ---------------- مدل AI اختیاری (همان env چت‌بات) ---------------- */

async function tryAiReport(
  input: AnalyzeInput,
  f: FetchResult | null,
  scores: SiteScores | null
): Promise<Partial<AnalyzeResult> | null> {
  const base = process.env.CHAT_API_BASE;
  const key = process.env.CHAT_API_KEY;
  const model = process.env.CHAT_MODEL;
  if (!base || !key || !model) return null;

  const facts = [
    `کسب‌وکار: ${input.business}`,
    input.industry ? `صنعت: ${input.industry}` : null,
    input.location ? `موقعیت: ${input.location}` : null,
    input.goal ? `هدف: ${input.goal}` : null,
    f?.ok
      ? `داده‌های سایت: عنوان="${f.title}"، متا="${f.meta_description ?? "ندارد"}"، H1=[${f.h1s.join("|")}]، SSL=${f.ssl}، سرعت=${f.load_ms}ms، حجم=${f.size_kb}KB، CTA=[${f.cta_keywords.join("،")}]، اعتماد=[${f.trust_keywords.join("،")}، فرم=${f.has_form}`
      : `وب‌سایت: ${f?.not_found_reason ?? "ارائه نشده"}`,
    scores ? `امتیازها: SEO=${scores.seo_total}، تجربه=${scores.ux_total}، اعتماد=${scores.trust_total}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        model,
        temperature: 0.35,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content:
              "تو تحلیلگر کسب‌وکار هستی. فقط بر اساس «داده‌های واقعی» زیر پاسخ بده. چیزی که در داده نیست را با «نیاز به بررسی» مشخص کن — هرگز داده نساز. خروجی را دقیقاً در قالب JSON معتبر بده با کلیدهای: positioning (یک پاراگراف فارسی)، signals (آرایه ۳ تا ۵ رشته فارسی)، ai_opportunities (آرایه ۳ تا ۵ رشته)، strengths (آرایه)، weaknesses (آرایه)، quick_wins (آرایه از {action,impact,effort,priority})، plan_30_days (آرایه از {week,tasks[]}).",
          },
          { role: "user", content: facts },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content;
    if (!text) return null;
    const json = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(json) as Partial<AnalyzeResult>;
    return parsed;
  } catch {
    return null; // بی‌سروصدا به موتور قاعده‌محور برمی‌گردیم
  }
}

/* ---------------- موتور قاعده‌محور — فقط از داده‌ی واقعی ---------------- */

function buildReport(
  input: AnalyzeInput,
  f: FetchResult | null,
  scores: SiteScores | null,
  ai: Partial<AnalyzeResult> | null
): AnalyzeResult {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const quickWins: AnalyzeResult["quick_wins"] = [];

  if (f?.ok && scores) {
    if (f.ssl) strengths.push(`وب‌سایت با HTTPS امن است.`);
    else weaknesses.push("وب‌سایت HTTPS ندارد — مرورگرها هشدار امنیتی می‌دهند و اعتماد مشتری کم می‌شود.");
    if (f.title) strengths.push(`عنوان صفحه‌ی اصلی: «${f.title}»`);
    else weaknesses.push("تگ title مشخص ندارد — مهم‌ترین سیگنال SEO غایب است.");
    if (!f.meta_description) {
      weaknesses.push("توضیحات متا ندارد — در نتایج گوگل متن دلخواه نمایش داده نمی‌شود.");
      quickWins.push({ action: "نوشتن meta description حرفه‌ای (۵۰–۱۶۰ نویسه) برای صفحه‌ی اصلی", impact: "افزایش نرخ کلیک از گوگل", effort: "کم — کمتر از یک ساعت", priority: "بالا" });
    }
    if (!f.has_viewport_meta) {
      weaknesses.push("متای viewport ندارد — نمایش موبایل احتمالاً خراب است.");
      quickWins.push({ action: "افزودن تگ viewport برای نمایش صحیح موبایل", impact: "رفع مشکل نمایش در بیش از نیمی از بازدیدها", effort: "کم", priority: "بالا" });
    }
    if (f.load_ms > 3000) {
      weaknesses.push(`پاسخ سرور کند است (${(f.load_ms / 1000).toFixed(1)} ثانیه) — کاربر قبل از دیدن سایت می‌رود.`);
      quickWins.push({ action: "بهینه‌سازی سرعت (کش، فشرده‌سازی، بهینه‌سازی تصاویر)", impact: "کاهش ریزش بازدیدکننده", effort: "متوسط", priority: "بالا" });
    }
    if (!f.has_form) {
      weaknesses.push("در صفحه‌ی اصلی فرم ثبت/تماس دیده نشد — مسیر تبدیل بازدیدکننده به لید ضعیف است.");
      quickWins.push({ action: "افزودن فرم درخواست مشاوره در صفحه‌ی اصلی", impact: "تبدیل بازدید به لید", effort: "متوسط", priority: "بالا" });
    }
    if (f.cta_keywords.length === 0) {
      weaknesses.push("فراخوان اقدام (CTA) مشخصی در متن صفحه یافت نشد.");
      quickWins.push({ action: "افزودن CTA واضح مانند «درخواست مشاوره رایگان» در بالای صفحه", impact: "افزایش نرخ تبدیل", effort: "کم", priority: "بالا" });
    }
    if (f.image_count > 0 && f.image_without_alt / f.image_count > 0.4) {
      quickWins.push({ action: "افزودن alt به تصاویر (الان بیشترِ تصاویر بدون alt است)", impact: "SEO تصاویر و دسترسی‌پذیری", effort: "کم", priority: "متوسط" });
    }
    if (f.trust_keywords.length === 0) {
      weaknesses.push("نشانه‌ی اعتماد صریح (نمونه‌کار، نظرات، نماد اعتماد و…) در صفحه دیده نشد.");
      quickWins.push({ action: "افزودن بخش نمونه‌کارها/نظرات مشتریان به صفحه‌ی اصلی", impact: "اعتماد و تبدیل بیشتر", effort: "متوسط", priority: "متوسط" });
    }
  } else {
    weaknesses.push(`وب‌سایت بررسی نشد: ${f?.not_found_reason ?? "آدرس ارائه نشده"} — پس از دسترس‌پذیری، تحلیل مجدد دقیق‌تر می‌شود.`);
  }

  const aiOps =
    ai?.ai_opportunities?.length
      ? ai.ai_opportunities
      : [
          "چت‌بات هوشمند پاسخ‌گویی ۲۴ ساعته (همان سیستمی که در همین سایت نصب است)",
          "اتوماسیون ثبت و پیگیری لیدها با n8n — هیچ درخواستی گم نشود",
          "داشبورد هفتگی شاخص‌ها: بازدید، لید، نرخ تبدیل",
        ];

  const plan: AnalyzeResult["plan_30_days"] = [
    {
      week: "هفته ۱ — زیرساخت",
      tasks: [
        weaknesses.length ? `اصلاح اسیلوت اولیه: ${weaknesses[0]}` : "پایش دقیق‌تر وضعیت موجود",
        "نصب ردیابی بازدید و رویدادها (الان در همین سایت فعال است)",
        "تعیین یک شاخص اصلی ماهانه (مثلاً تعداد لید)",
      ],
    },
    {
      week: "هفته ۲ — محتوا و تبدیل",
      tasks: [
        "بهبود عنوان و توضیحات متا بر اساس کلمات کلیدی صنعت",
        "افزودن/تقویت CTA و فرم مشاوره",
        "ساخت ۲ محتوای آموزشی مرتبط با صنعت",
      ],
    },
    {
      week: "هفته ۳ — اتوماسیون و فروش",
      tasks: [
        "راه‌اندازی پیگیری خودکار لیدها",
        "اتصال فرم‌ها به CRM یا فایل مرکزی",
        "پیام خودکار واکنش سریع به درخواست‌های جدید",
      ],
    },
    {
      week: "هفته ۴ — بهینه‌سازی",
      tasks: [
        "بررسی شاخص‌های ماه و مقایسه با هفته ۱",
        "حذف گلوگاه‌های تبدیل شناسایی‌شده",
        "برنامه‌ی ماه دوم بر اساس داده",
      ],
    },
  ];

  const positioning =
    ai?.positioning ??
    `${input.business}${input.location ? ` در ${input.location}` : ""}${input.industry ? ` در حوزه‌ی ${input.industry}` : ""} — ${
      scores
        ? `وضعیت دیجیتال فعلی: SEO ${scores.seo_total} از ۱۰۰، تجربه‌ی کاربری ${scores.ux_total} از ۱۰۰، اعتماد ${scores.trust_total} از ۱۰۰.`
        : "بدون وب‌سایت قابل‌بررسی — هویت دیجیتال ضعیف یا وابسته به کانال‌های دیگر."
    }`;

  return {
    business: input.business,
    industry: input.industry ?? "نامشخص",
    location: input.location ?? "نامشخص",
    website: input.website ?? "ارائه نشده",
    social: input.social ?? "ارائه نشده",
    goal: input.goal ?? "نامشخص",
    website_analysis: {
      fetched: !!f?.ok,
      note: f?.ok ? "صفحه‌ی اصلی به‌صورت عمومی واکشی و تحلیل شد." : f?.not_found_reason ?? "آدرس سایت ارائه نشده — تحلیل وب‌سایت انجام نشد.",
      data: f,
      scores,
    },
    market_analysis: {
      positioning,
      signals:
        ai?.signals ??
        [
          scores ? `امتیاز فنی وب‌سایت: ${scores.seo_total}/۱۰۰` : "وب‌سایت قابل‌بررسی نبود",
          "تحلیل رقبا نیازمند دسترسی به داده‌ی جست‌وجو است — در نسخه‌ی فعلی رقبا به‌صورت دستی بررسی می‌شوند",
        ],
      confidence: scores ? "MEDIUM" : "LOW",
    },
    competitor_note:
      "در نسخه‌ی فعلی، کشف خودکار رقبا فعال نیست (نیازمند سرویس جست‌وجو). رقبا و مقایسه‌ی دقیق، در جلسه‌ی مشاوره به‌صورت دستی و مستند انجام می‌شود — به‌جای حدس، صادقانه NOT VERIFIED ثبت می‌شود.",
    ai_opportunities: aiOps,
    strengths: ai?.strengths?.length ? ai.strengths : strengths.length ? strengths : ["پس از ارائه‌ی وب‌سایت، نقاط قوت دقیق‌تر شناسایی می‌شود."],
    weaknesses: ai?.weaknesses?.length ? ai.weaknesses : weaknesses.length ? weaknesses : ["مورد مشخصی از داده‌های فعلی استخراج نشد."],
    quick_wins: ai?.quick_wins?.length ? ai.quick_wins : quickWins.slice(0, 6),
    plan_30_days: ai?.plan_30_days?.length ? ai.plan_30_days : plan,
    strategy_note:
      "برنامه‌ی ۹۰ روزه‌ی کامل (ماه ۲ رشد، ماه ۳ بهینه‌سازی) به‌صورت اختصاصی در جلسه‌ی مشاوره بر اساس داده‌های واقعی صنعت شما طراحی می‌شود.",
    generated_by: ai ? "ai-model" : "rules-engine",
    created_at: new Date().toISOString(),
  };
}