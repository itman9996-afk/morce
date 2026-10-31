"use client";

import { BrainCircuit, Gauge, GitBranch, Headset, HeartHandshake, MessagesSquare, Sparkles, Timer, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { FlowLine } from "@/components/sections/service-shared";
import { cn } from "@/lib/site-config";

function NodeChip({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="card-glow flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs leading-6 text-white/70">{desc}</span>
      </span>
    </div>
  );
}

export function AISystemSection() {
  const top: Array<[LucideIcon, string, string]> = [[MessagesSquare, "چت‌بات هوشمند", "پاسخ ۲۴ ساعته با لحن برند"], [BrainCircuit, "AI Agent", "ایجنت‌های مجری وظایف"], [TrendingUp, "فروش هوشمند", "پیگیری و ارزیابی لید"]];
  const bottom: Array<[LucideIcon, string, string]> = [[Headset, "پشتیبانی هوشمند", "دسته‌بندی و پاسخ تیکت‌ها"], [Users, "CRM هوشمند", "مشتری، یک‌جا و مرتب"], [Sparkles, "دستیار اختصاصی", "سیستم متناسب با کسب‌وکار شما"]];

  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="ai-system-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="ai-system-title" align="center" eyebrow="سیستم AI" title="یک هسته‌ی هوشمند در مرکز کسب‌وکار شما" description="داده وارد می‌شود، هوش مصنوعی تحلیل و تصمیم می‌گیرد و اقدام انجام می‌شود — همه‌ی اجزا به یک هسته متصل‌اند." />
        </Reveal>
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid gap-3 sm:grid-cols-3">
            {top.map(([Icon, title, desc]) => (<Reveal key={title}><NodeChip icon={Icon} title={title} desc={desc} /></Reveal>))}
          </div>
          <div className="my-2"><FlowLine vertical /></div>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-violet-500 p-8 text-center text-white md:p-10 shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)]">
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/15" />
              <div className="relative">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/70">AI CORE</span>
                <p className="mt-2 text-2xl font-bold md:text-3xl">هسته‌ی هوش مصنوعی</p>
                <p className="mt-2 text-sm text-white/80">تحلیل داده ← تصمیم ← اقدام ← یادگیری مداوم</p>
              </div>
            </div>
          </Reveal>
          <div className="my-2"><FlowLine vertical /></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {bottom.map(([Icon, title, desc]) => (<Reveal key={title}><NodeChip icon={Icon} title={title} desc={desc} /></Reveal>))}
          </div>
        </div>
      </Container>
    </section>
  );
}

const agentSteps: Array<[LucideIcon, string, string]> = [[MessagesSquare, "پیام مشتری", "از هر کانالی"], [BrainCircuit, "درک پیام", "تشخیص نیت و نیاز"], [GitBranch, "تصمیم", "انتخاب مسیر درست"], [Zap, "اقدام", "پاسخ، ثبت یا ارجاع"], [Users, "ثبت در CRM", "داده مرتب و به‌روز"]];

export function AIAgentFlowSection() {
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="ai-agent-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[150px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="ai-agent-title" align="center" eyebrow="AI Agents" title="ایجنت هوشمند چطور کار می‌کند؟" description="از لحظه‌ی دریافت پیام تا ثبت نتیجه در CRM — بدون دخالت انسانی در مراحل تکراری." />
        </Reveal>
        <ol className="mt-12 flex flex-col items-stretch justify-center gap-2 md:flex-row md:items-center">
          {agentSteps.map(([Icon, title, desc], i) => (
            <li key={title} className="flex items-center gap-2 md:flex-1">
              <Reveal delay={i * 0.06} className="w-full">
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm">
                  <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-6 text-white/70">{desc}</p>
                </div>
              </Reveal>
              {i < agentSteps.length - 1 ? <span className="hidden md:block md:w-6"><FlowLine /></span> : null}
            </li>
          ))}
        </ol>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <span className="chip-gradient inline-block rounded-full px-3 py-1 text-[0.65rem] font-semibold text-white">نمونه‌ی گفت‌وگو</span>
            <div className="mt-4 space-y-3 text-sm leading-7">
              <p className="ms-auto max-w-[85%] rounded-2xl rounded-se-sm bg-white/10 px-4 py-2.5 text-white/85">سلام، برای رستورانم ریلز تبلیغاتی می‌خوام. هزینه‌اش چقدره؟</p>
              <p className="me-auto max-w-[85%] rounded-2xl rounded-ss-sm bg-accent/10 px-4 py-2.5 text-white">سلام! بسته‌ی ریلز ماهانه ۸ ویدیو داریم. صنعت و هدفتون رو بگید تا پیشنهاد دقیق بدم. ✅ این لید در CRM ثبت و به تیم فروش اطلاع داده شد.</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

const salesBars: Array<{ label: string; width: string }> = [{ label: "لیدهای پیگیری‌شده", width: "w-4/5" }, { label: "پاسخ‌های خودکار", width: "w-2/3" }, { label: "فرصت‌های باز", width: "w-1/2" }];

export function AICrmSalesSection() {
  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="ai-ui-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="ai-ui-title" align="center" eyebrow="CRM و فروش" title="هوش مصنوعی، جایی که داده‌های شما زندگی می‌کنند" description="نمای ساده‌شده از رابط‌کاربری‌هایی که کنار هم کار می‌کنند؛ نمونه‌ی نمایشی است و پس از اتصال به سیستم شما، با داده‌های واقعی پر می‌شود." />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Reveal>
            <div className="card-glow h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-sm font-semibold text-white">CRM</span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.6rem] font-semibold text-accent">نمای نمونه</span>
              </div>
              <ul className="space-y-2 p-4">
                {["لید جدید — از فرم سایت", "در حال پیگیری — تماس فردا", "مشتری وفادار — خرید مجدد"].map((row, i) => (
                  <li key={row} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white/85">
                    <span className={cn("size-2 shrink-0 rounded-full", i === 0 ? "bg-accent" : i === 1 ? "bg-amber-400" : "bg-emerald-400")} />
                    {row}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="card-glow h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-sm font-semibold text-white">دستیار فروش</span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.6rem] font-semibold text-accent">نمای نمونه</span>
              </div>
              <div className="space-y-2.5 p-4">
                {salesBars.map((bar) => (
                  <div key={bar.label}>
                    <span className="text-xs text-white/80">{bar.label}</span>
                    <span className="mt-1 block h-2.5 rounded-full bg-white/10">
                      <span className={cn("block h-full rounded-full bg-gradient-to-l from-accent to-violet-500", bar.width)} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="card-glow h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="text-sm font-semibold text-white">پشتیبانی</span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.6rem] font-semibold text-accent">نمای نمونه</span>
              </div>
              <ul className="space-y-2 p-4 text-xs">
                <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-white/85">سوال قیمت — پاسخ خودکار</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-400">حل شد</span>
                </li>
                <li className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-white/85">مشکل فنی — ارجاع به تیم</span>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.6rem] font-semibold text-amber-400">در جریان</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

const outcomes: Array<[LucideIcon, string, string]> = [[Timer, "کار دستی کمتر", "کارهای تکراری به AI سپرده می‌شود."], [BrainCircuit, "هوشمندی بیشتر", "تصمیم‌ها بر اساس داده گرفته می‌شوند."], [Gauge, "تصمیم سریع‌تر", "پاسخ در ثانیه، نه در جلسه‌ی بعدی."], [HeartHandshake, "تجربه‌ی بهتر مشتری", "هیچ پیامی بی‌جواب نمی‌ماند."]];

export function AIOutcomeSection() {
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="ai-outcome-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="ai-outcome-title" align="center" eyebrow="نتیجه" title="AI یعنی چه تغییری در کسب‌وکار شما؟" />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map(([Icon, title, desc], i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="card-glow h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet-500 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-white/70">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}