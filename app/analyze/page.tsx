"use client";

/**
 * صفحه‌ی تحلیل کسب‌وکار — /analyze
 *  فرم → پیشرفت واقعی (polling سرور) → گزارش کامل → دانلود PDF (پرینت مرورگر) / JSON → فرم لید رضایت‌دار
 *  از سیستم طراحی موجود استفاده می‌کند؛ هیچ چیز دیگری از سایت دست نمی‌خورد.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  Check,
  CircleCheck,
  Download,
  FileText,
  Gauge,
  Loader2,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { AnalyzeResult } from "@/lib/analyze/engine";
import { cn } from "@/lib/site-config";

type Phase = "form" | "running" | "done";

interface StepView {
  id: string;
  label: string;
  done: boolean;
}

const SCORE_CARDS = [
  { key: "seo_total", label: "سئو", Icon: Search },
  { key: "ux_total", label: "تجربه‌ی کاربری", Icon: Gauge },
  { key: "trust_total", label: "اعتماد و CTA", Icon: ShieldCheck },
] as const;

export default function AnalyzePage() {
  const [phase, setPhase] = useState<Phase>("form");
  const [form, setForm] = useState({ business: "", industry: "", location: "", website: "", social: "", goal: "" });
  const [jobId, setJobId] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepView[]>([]);
  const [state, setState] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  /* پیشرفت واقعی — polling هر ۱.۵ ثانیه */
  useEffect(() => {
    if (phase !== "running" || !jobId) return;
    let stopped = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/analyze?id=${encodeURIComponent(jobId)}`);
        const data = (await res.json()) as {
          ok: boolean;
          state?: string;
          steps?: StepView[];
          result?: AnalyzeResult | null;
          error?: string | null;
        };
        if (stopped) return;
        if (data.steps) setSteps(data.steps);
        if (data.state) setState(data.state);
        if (data.state === "COMPLETED" && data.result) {
          setResult(data.result);
          setPhase("done");
          return;
        }
        if (data.state === "FAILED") {
          setError(data.error ?? "تحلیل ناموفق بود.");
          setPhase("form");
          return;
        }
        setTimeout(poll, 1500);
      } catch {
        if (!stopped) setTimeout(poll, 2500);
      }
    };

    poll();
    return () => {
      stopped = true;
    };
  }, [phase, jobId]);

  const start = useCallback(async () => {
    setError(null);
    if (form.business.trim().length < 2) {
      setError("نام کسب‌وکار را بنویس — بقیه اختیاری است.");
      return;
    }
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; id?: string; message?: string };
      if (!data.ok || !data.id) {
        setError(data.message ?? "شروع تحلیل ناموفق بود.");
        return;
      }
      setJobId(data.id);
      setSteps([]);
      setPhase("running");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    }
  }, [form]);

  /* ---------- فرم ---------- */
  if (phase === "form") {
    return (
      <section className="py-16 md:py-24">
        <div className="container-site max-w-3xl">
          <div className="ornament mb-10">
            <span aria-hidden="true" />
          </div>
          <span className="chip-gradient mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white">
            <Sparkles className="size-4" aria-hidden="true" />
            تحلیل رایگان کسب‌وکار
          </span>
          <h1 className="mt-5 text-center text-3xl font-bold leading-[1.4] md:text-4xl">
            کسب‌وکارت را <span className="gradient-text">هوشمند</span> تحلیل کن
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-8 text-muted md:text-base">
            فقط نام کسب‌وکار را بنویس — وب‌سایتت را بررسی می‌کنیم، امتیاز واقعی می‌گیری و برنامه‌ی عملی ۳۰ روزه تحویل می‌دهی. بقیه‌ی فیلدها اختیاری‌اند.
          </p>

          <div className="mt-10 rounded-3xl border border-line bg-white/90 p-6 shadow-[0_24px_60px_-30px_rgba(32,37,43,0.3)] md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="a-business" className="label-base">نام کسب‌وکار *</label>
                <input
                  id="a-business"
                  className="input-base"
                  value={form.business}
                  onChange={(e) => setForm((f) => ({ ...f, business: e.target.value }))}
                  placeholder="مثلاً: کافه لیمو"
                  maxLength={120}
                />
              </div>
              <div>
                <label htmlFor="a-industry" className="label-base">حوزه‌ی فعالیت</label>
                <input id="a-industry" className="input-base" value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} placeholder="کافه، کلینیک، فروشگاه…" maxLength={120} />
              </div>
              <div>
                <label htmlFor="a-location" className="label-base">شهر</label>
                <input id="a-location" className="input-base" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="تهران" maxLength={120} />
              </div>
              <div>
                <label htmlFor="a-website" className="label-base">وب‌سایت (برای تحلیل فنی)</label>
                <input id="a-website" dir="ltr" className="input-base text-end" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="example.com" maxLength={300} />
              </div>
              <div>
                <label htmlFor="a-social" className="label-base">اینستاگرام / شبکه اجتماعی</label>
                <input id="a-social" dir="ltr" className="input-base text-end" value={form.social} onChange={(e) => setForm((f) => ({ ...f, social: e.target.value }))} placeholder="@instagram" maxLength={300} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="a-goal" className="label-base">هدف اصلی‌ات چیست؟</label>
                <input id="a-goal" className="input-base" value={form.goal} onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))} placeholder="مثلاً: افزایش فروش آنلاین" maxLength={500} />
              </div>
            </div>

            {error ? (
              <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            ) : null}

            <button
              type="button"
              onClick={start}
              className="btn-gradient mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgba(83,103,217,0.7)]"
            >
              <BarChart3 className="size-5" aria-hidden="true" />
              تحلیل کسب‌وکار من
            </button>
            <p className="mt-3 text-center text-xs leading-6 text-muted">
              فقط اطلاعات عمومی بررسی می‌شود؛ هیچ داده‌ی خصوصی جمع نمی‌شود و گزارش در مرورگر خودت نمایش داده می‌شود.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- پیشرفت واقعی ---------- */
  if (phase === "running") {
    return (
      <section className="py-16 md:py-24">
        <div className="container-site max-w-2xl">
          <div className="rounded-3xl border border-line bg-white/90 p-8 md:p-10">
            <div className="flex items-center gap-3">
              <Loader2 className="size-6 animate-spin text-accent" aria-hidden="true" />
              <h1 className="text-xl font-bold">در حال تحلیل «{form.business}»…</h1>
            </div>

            <ul className="mt-8 space-y-4">
              {(steps.length
                ? steps
                : [
                    { id: "identify", label: "شناسایی کسب‌وکار", done: false },
                    { id: "fetch", label: "بررسی وب‌سایت", done: false },
                    { id: "score", label: "امتیازدهی و اثبات‌ها", done: false },
                    { id: "strategy", label: "تولید استراتژی", done: false },
                    { id: "report", label: "ساخت گزارش", done: false },
                  ]
              ).map((s) => (
                <motion.li key={s.id} className="flex items-center gap-3" initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
                      s.done ? "bg-gradient-to-br from-accent to-violet-500 text-white" : "border border-line bg-background text-muted"
                    )}
                  >
                    {s.done ? <Check className="size-4" aria-hidden="true" /> : <Loader2 className={cn("size-4 animate-spin", state !== "COMPLETED" && "")} aria-hidden="true" />}
                  </span>
                  <span className={cn("text-sm font-medium", s.done ? "text-ink" : "text-muted")}>{s.label}</span>
                  {s.done ? <CircleCheck className="ms-auto size-4 text-emerald-500" aria-hidden="true" /> : null}
                </motion.li>
              ))}
            </ul>

            <p className="mt-8 text-xs leading-6 text-muted">
              هر مرحله فقط وقتی تیک می‌خورد که واقعاً تمام شده باشد — پیشرفت نمایشی نیست.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- گزارش نهایی ---------- */
  if (!result) return null;
  const wa = result.website_analysis;

  return (
    <section className="py-14 md:py-20 print:py-0">
      <div className="container-site max-w-4xl">
        {/* سربرگ گزارش */}
        <div className="rounded-3xl border border-line bg-gradient-to-l from-accent to-violet-500 p-8 text-white md:p-10">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">گزارش تحلیل کسب‌وکار</span>
          <h1 className="mt-4 text-2xl font-black md:text-3xl">{result.business}</h1>
          <p className="mt-2 text-sm text-white/85">
            {result.industry} • {result.location} • هدف: {result.goal}
          </p>
          <p className="mt-4 text-xs text-white/70">
            منبع تحلیل: {result.generated_by === "ai-model" ? "مدل هوش مصنوعی + داده‌ی واقعی وب‌سایت" : "موتور تحلیل قاعده‌محور از داده‌ی واقعی وب‌سایت"} — {new Date(result.created_at).toLocaleDateString("fa-IR")}
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-gradient inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold text-white"
          >
            <Printer className="size-4" aria-hidden="true" />
            دانلود PDF
          </button>
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result, null, 2))}`}
            download={`analysis-${result.business.replace(/\s+/g, "-")}.json`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-6 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <Download className="size-4" aria-hidden="true" />
            دانلود داده (JSON)
          </a>
          <a
            href="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-6 text-sm font-bold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            درخواست تحلیل عمیق‌تر
            <ArrowLeft className="size-4" aria-hidden="true" />
          </a>
        </div>

        {/* امتیازها */}
        {wa.scores ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {SCORE_CARDS.map(({ key, label, Icon }) => (
              <div key={key} className="card-glow rounded-3xl border border-line bg-white/90 p-6 text-center">
                <Icon className="mx-auto size-6 text-accent" aria-hidden="true" />
                <p className="mt-2 text-3xl font-black text-ink">{wa.scores![key].toLocaleString("fa-IR")}</p>
                <p className="text-xs text-muted">امتیاز {label} از ۱۰۰</p>
                <div className="mt-3 h-2 rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-accent to-violet-500"
                    style={{ width: `${wa.scores![key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-dashed border-accent/40 bg-accent-soft/30 p-5 text-sm leading-7 text-ink/85">
            <TriangleAlert className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
            <span>وب‌سایتی برای تحلیل فنی ارائه نشد یا در دسترس نبود: {wa.note}</span>
          </div>
        )}

        {/* ریز اثبات‌ها */}
        {wa.scores ? (
          <ReportSection title="اثبات‌ها — هر امتیاز با دلیل" Icon={FileText}>
            <div className="space-y-6">
              {[
                { title: "سئو", items: wa.scores.seo },
                { title: "تجربه‌ی کاربری", items: wa.scores.ux },
                { title: "اعتماد و CTA", items: wa.scores.trust },
              ].map((group) => (
                <div key={group.title}>
                  <h4 className="mb-2 text-sm font-bold text-ink">{group.title}</h4>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item.label} className="rounded-2xl border border-line bg-background/70 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-ink">{item.label}</span>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold",
                              item.status === "NOT FOUND" ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"
                            )}
                          >
                            {item.status === "NOT FOUND" ? "یافت نشد" : "بررسی‌شده"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-6 text-muted">{item.evidence}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ReportSection>
        ) : null}

        {/* جایگاه بازار */}
        <ReportSection title="جایگاه بازار" Icon={BarChart3}>
          <p className="text-sm leading-8 text-ink/90">{result.market_analysis.positioning}</p>
          <ul className="mt-4 space-y-2">
            {result.market_analysis.signals.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted">
                <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">سطح اطمینان: {result.market_analysis.confidence === "HIGH" ? "بالا" : result.market_analysis.confidence === "MEDIUM" ? "متوسط" : "کم"}</p>
        </ReportSection>

        {/* قوت و ضعف */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReportSection title="نقاط قوت" Icon={CircleCheck} tone="ok">
            <BulletList items={result.strengths} />
          </ReportSection>
          <ReportSection title="ضعف‌های شناسایی‌شده" Icon={TriangleAlert} tone="warn">
            <BulletList items={result.weaknesses} />
          </ReportSection>
        </div>

        {/* بردهای سریع */}
        {result.quick_wins.length ? (
          <ReportSection title="بردهای سریع — اول این‌ها" Icon={Sparkles}>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.quick_wins.map((q) => (
                <div key={q.action} className="rounded-2xl border border-line bg-background/70 p-4">
                  <p className="text-sm font-bold text-ink">{q.action}</p>
                  <p className="mt-1.5 text-xs leading-6 text-muted">اثر: {q.impact} • سختی: {q.effort}</p>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold",
                      q.priority === "بالا" ? "bg-accent-soft text-accent" : "bg-line text-ink/70"
                    )}
                  >
                    اولویت {q.priority}
                  </span>
                </div>
              ))}
            </div>
          </ReportSection>
        ) : null}

        {/* برنامه ۳۰ روزه */}
        <ReportSection title="برنامه‌ی ۳۰ روزه" Icon={Bot}>
          <ol className="space-y-4">
            {result.plan_30_days.map((w) => (
              <li key={w.week} className="rounded-2xl border border-line bg-background/70 p-5">
                <h4 className="text-sm font-bold text-accent">{w.week}</h4>
                <ul className="mt-2 space-y-1.5">
                  {w.tasks.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm leading-7 text-ink/85">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {t}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs leading-6 text-muted">{result.strategy_note}</p>
        </ReportSection>

        {/* شفافیت: چه چیزی در این نسخه نیست */}
        <ReportSection title="شفافیت و محدودیت‌ها" Icon={FileText}>
          <ul className="space-y-2 text-sm leading-7 text-muted">
            <li>• {result.competitor_note}</li>
            <li>• تحلیل شبکه‌های اجتماعی فقط با داده‌ی عمومی قابل‌تأیید انجام می‌شود؛ اینستاگرام بدون ورود قابل واکشی نیست و حدس زده نمی‌شود.</li>
            <li>• هیچ قیمتی از رقبا یا بازار «تخمینی» نمایش داده نمی‌شود — قیمت عمومی تأییدنشده = ذکر نمی‌شود.</li>
          </ul>
        </ReportSection>

        {/* CTA لید */}
        <div className="cta-band mt-8 rounded-3xl p-8 text-center md:p-10">
          <h2 className="text-xl font-bold md:text-2xl">
            می‌خواهی این توصیه‌ها را <span className="gradient-text">برایت اجرا کنیم؟</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink/70">
            همین گزارش را مبنا قرار می‌دهیم و مرحله‌به‌مرحله پیاده‌سازی می‌کنیم — از اصلاحات سایت تا اتوماسیون لیدها.
          </p>
          <a
            href="/contact"
            className="btn-gradient mt-6 inline-flex h-12 items-center gap-2 rounded-full px-8 text-sm font-bold text-white"
          >
            درخواست جلسه‌ی مشاوره
            <ArrowLeft className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- اجزای کمکی گزارش ---------- */

function ReportSection({
  title,
  Icon,
  tone,
  children,
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | undefined }>;
  tone?: "ok" | "warn";
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-line bg-white/90 p-6 md:p-8 print:break-inside-avoid">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl text-white",
            tone === "warn" ? "bg-amber-500" : tone === "ok" ? "bg-emerald-500" : "bg-gradient-to-br from-accent to-violet-500"
          )}
        >
          <Icon className="size-4" aria-hidden={true} />
        </span>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-7 text-ink/85">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}