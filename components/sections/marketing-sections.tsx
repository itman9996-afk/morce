"use client";

import { Eye, HeartHandshake, Magnet, RefreshCcw, Search, ShoppingBag, Target, UserPlus, type LucideIcon } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { FlowLine } from "@/components/sections/service-shared";
import { cn } from "@/lib/site-config";

/* ---------------- SECTION 02 — GROWTH ENGINE ---------------- */
const pillars: Array<{ icon: LucideIcon; title: string; en: string; items: string[] }> = [
  { icon: Magnet, title: "جذب", en: "ACQUISITION", items: ["تبلیغات هدفمند", "SEO", "شبکه‌های اجتماعی", "محتوا"] },
  { icon: Target, title: "تبدیل", en: "CONVERSION", items: ["لندینگ‌پیج", "پیشنهاد درست", "CTA واضح", "مسیر فروش"] },
  { icon: RefreshCcw, title: "نگه‌داشت", en: "RETENTION", items: ["CRM", "ریتارگتینگ", "ایمیل و پیامک", "سفر مشتری"] },
];

export function GrowthEngineSection() {
  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="engine-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="engine-title" align="center" eyebrow="موتور رشد" title="سه چرخ‌دنده که باید با هم بچرخند" description="جذب بدون تبدیل هدررفت است؛ تبدیل بدون نگه‌داشت، تکرار نمی‌شود." />
        </Reveal>

        <div className="relative mt-12">
          <div aria-hidden="true" className="absolute inset-x-16 top-14 hidden h-px bg-gradient-to-l from-accent/0 via-accent/40 to-accent/0 lg:block" />
          <div className="grid gap-5 lg:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.en} delay={i * 0.08}>
                <div className="card-glow relative h-full rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet-500 text-white">
                      <pillar.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-accent">{pillar.en}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{pillar.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {pillar.items.map((item) => (
                      <li key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- SECTION 03 — MARKETING FUNNEL ---------------- */
const funnel: Array<{ icon: LucideIcon; title: string; desc: string; width: number }> = [
  { icon: Eye, title: "آگاهی", desc: "برند دیده می‌شود", width: 100 },
  { icon: Search, title: "علاقه", desc: "جست‌وجو و بررسی", width: 84 },
  { icon: Target, title: "بررسی", desc: "مقایسه با گزینه‌ها", width: 68 },
  { icon: UserPlus, title: "لید", desc: "تماس یا ثبت فرم", width: 52 },
  { icon: ShoppingBag, title: "فروش", desc: "خرید انجام می‌شود", width: 38 },
  { icon: HeartHandshake, title: "وفاداری", desc: "خرید مجدد و معرفی", width: 28 },
];

export function FunnelSection() {
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="funnel-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[150px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="funnel-title" align="center" eyebrow="قیف فروش" title="مسیر مخاطب، از آگاهی تا وفاداری" description="کار ما این است که در هر مرحله، کمترین ریزش و بیشترین عبور اتفاق بیفتد." />
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl space-y-2">
          {funnel.map((stage, i) => (
            <Reveal key={stage.title} delay={i * 0.05}>
              <div className="mx-auto" style={{ width: `${stage.width}%` }}>
                <div className={cn("flex items-center gap-3 rounded-2xl border border-accent/25 px-5 py-3.5 text-white", i % 2 === 0 ? "bg-gradient-to-l from-accent to-violet-500" : "bg-gradient-to-l from-accent/85 to-violet-500/85")}>
                  <stage.icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className="font-semibold">{stage.title}</span>
                  <span className="ms-auto hidden text-xs text-white/80 sm:block">{stage.desc}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- SECTION 04 — ANALYTICS ---------------- */
export function AnalyticsSection() {
  const kpis = ["ترافیک", "لید", "نرخ تبدیل", "بازگشت سرمایه‌ی تبلیغات (ROAS)"];
  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="analytics-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="analytics-title" align="center" eyebrow="تحلیل" title="تصمیم بر اساس داشبورد، نه حدس" description="نمای نمونه‌ی داشبوردی است که برای شما می‌سازیم؛ پس از اتصال به داده‌های واقعی کسب‌وکارتان، همین با اعداد واقعی شما پر می‌شود." />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <span className="text-sm font-semibold text-white">داشبورد رشد</span>
              <span className="rounded-full bg-accent/10 px-3 py-0.5 text-[0.6rem] font-semibold text-accent">داده‌های نمونه</span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {kpis.map((label, i) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="mt-2.5 flex items-end gap-1.5" aria-hidden="true">
                    {[40, 65, 50, 80, 60, 95].map((h, j) => (
                      <span key={j} className={cn("w-3 rounded-t-md", j === 5 ? "bg-gradient-to-t from-accent to-violet-500" : "bg-white/10", i % 2 === 1 && "opacity-80")} style={{ height: `${h * (0.7 + i * 0.08)}px` }} />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------- SECTION 05 — RETARGETING JOURNEY ---------------- */
const journey: Array<[LucideIcon, string]> = [
  [Eye, "بازدید"],
  [Search, "بررسی و خروج"],
  [RefreshCcw, "ریتارگتینگ"],
  [Target, "بازگشت"],
  [ShoppingBag, "تبدیل"],
];

export function RetargetingSection() {
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="retargeting-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="retargeting-title" align="center" eyebrow="ریتارگتینگ" title="کاربری که رفت، هنوز از دست نرفته" description="اکثر بازدیدکنندگان بار اول خرید نمی‌کنند؛ ریتارگتینگ آن‌ها را در زمان درست برمی‌گرداند." />
        </Reveal>

        <ol className="mt-12 flex flex-wrap items-center justify-center gap-y-3">
          {journey.map(([Icon, title], i) => (
            <li key={title} className="flex items-center">
              <Reveal delay={i * 0.05}>
                <span className="flex flex-col items-center gap-1.5">
                  <span className={cn("flex size-12 items-center justify-center rounded-full border text-accent", title === "ریتارگتینگ" ? "border-transparent bg-gradient-to-br from-accent to-violet-500 text-white shadow-[0_10px_26px_-10px_rgba(83,103,217,0.65)]" : "border-white/10 bg-white/5")}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-white/85">{title}</span>
                </span>
              </Reveal>
              {i < journey.length - 1 ? <span className="mx-1 w-8"><FlowLine /></span> : null}
            </li>
          ))}
        </ol>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-dashed border-accent/50 bg-accent/5 px-4 py-2.5 text-sm font-medium text-accent">
            <RefreshCcw className="size-4" aria-hidden="true" />
            کمپین بازگشت چندمرحله‌ای — بدون آزار مخاطب، با کنترل تکرار
          </p>
        </Reveal>
      </Container>
    </section>
  );
}