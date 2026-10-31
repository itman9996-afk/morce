"use client";

import { Instagram, Mail, MessageCircle, ShoppingBag, UserPlus, Users, Webhook, X, Check, Zap, BrainCircuit, GitBranch, type LucideIcon } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { FlowLine } from "@/components/sections/service-shared";
import { cn } from "@/lib/site-config";

function FlowNode({ icon: Icon, title, desc, highlight = false }: { icon: LucideIcon; title: string; desc?: string; highlight?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border p-4 backdrop-blur-sm", highlight ? "border-accent/40 bg-gradient-to-br from-accent to-violet-500 text-white shadow-[0_14px_36px_-16px_rgba(83,103,217,0.6)]" : "border-white/10 bg-white/5")}>
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", highlight ? "bg-white/20 text-white" : "bg-accent/10 text-accent")}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className={cn("block text-sm font-semibold", highlight ? "text-white" : "text-white")}>{title}</span>
        {desc ? <span className={cn("block text-xs leading-6", highlight ? "text-white/80" : "text-white/70")}>{desc}</span> : null}
      </span>
    </div>
  );
}

export function AutomationBuilderSection() {
  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="builder-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="builder-title" align="center" eyebrow="چه چیزی را می‌شود خودکار کرد؟" title="یک Workflow واقعی، قدم به قدم" description="این دقیقاً همان سیستمی است که برای صدها پیام روزانه‌ی کسب‌وکار شما طراحی می‌کنیم." />
        </Reveal>
        <div className="mx-auto mt-12 max-w-xl">
          <Reveal><FlowNode icon={MessageCircle} title="WHEN — مشتری پیام می‌دهد" desc="از سایت، دایرکت یا واتساپ" /></Reveal>
          <div className="my-1"><FlowLine vertical /></div>
          <Reveal delay={0.05}><FlowNode icon={BrainCircuit} title="AI — نیت پیام را می‌فهمد" desc="سوال قیمت؟ درخواست؟ پشتیبانی؟" /></Reveal>
          <div className="my-1"><FlowLine vertical /></div>
          <Reveal delay={0.1}><FlowNode icon={GitBranch} title="IF — تصمیم مسیر" /></Reveal>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Reveal delay={0.14}>
              <div className="h-full rounded-2xl border border-accent/30 bg-accent/5 p-4 backdrop-blur-sm">
                <span className="chip-gradient inline-block rounded-full px-3 py-0.5 text-[0.6rem] font-bold text-white">بله — مشتری بالقوه</span>
                <div className="mt-3 space-y-2">
                  <FlowNode icon={Users} title="CRM — ثبت لید" />
                  <FlowNode icon={Zap} title="فروش — اطلاع فوری به تیم" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <span className="inline-block rounded-full bg-white/10 px-3 py-0.5 text-[0.6rem] font-bold text-white/70">خیر — سوال عمومی</span>
                <div className="mt-3"><FlowNode icon={MessageCircle} title="پاسخ خودکار" desc="بدون درگیر کردن تیم" /></div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

const n8nFlow: Array<[LucideIcon, string]> = [[Instagram, "اینستاگرام"], [Webhook, "Webhook"], [Zap, "n8n"], [BrainCircuit, "AI"], [Users, "CRM"], [Mail, "ایمیل / واتساپ"]];

export function N8nSection() {
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="n8n-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[150px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="n8n-title" align="center" eyebrow="n8n" title="قلب تپنده‌ی سیستم: n8n" description="گردش‌کارها روی n8n اجرا می‌شوند — خودمیزبان، مقیاس‌پذیر و بدون وابستگی به سرویس اشتراکی. مالکیت داده با شماست." />
        </Reveal>
        <Reveal delay={0.06}>
          <ol className="mt-12 flex flex-wrap items-center justify-center gap-y-3">
            {n8nFlow.map(([Icon, title], i) => {
              const isN8n = title === "n8n";
              return (
                <li key={title} className="flex items-center">
                  <span className={cn("flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold", isN8n ? "border-transparent bg-gradient-to-br from-accent to-violet-500 text-white shadow-[0_10px_26px_-10px_rgba(83,103,217,0.65)]" : "border-white/10 bg-white/5 text-white")}>
                    <Icon className={cn("size-4", isN8n ? "text-white" : "text-accent")} aria-hidden="true" />
                    {title}
                  </span>
                  {i < n8nFlow.length - 1 ? <span className="w-7"><FlowLine /></span> : null}
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}

const ops: Array<{ icon: LucideIcon; title: string; steps: string[] }> = [
  { icon: UserPlus, title: "لید", steps: ["ثبت لحظه‌ای", "دسته‌بندی هوشمند", "تخصیص به فروش"] },
  { icon: ShoppingBag, title: "فروش", steps: ["پیش‌فاکتور خودکار", "پیگیری زمان‌بندی‌شده", "یادآوری سبد رهاشده"] },
  { icon: Users, title: "پشتیبانی", steps: ["پاسخ تکراری‌ها با AI", "ارجاع موارد خاص", "گزارش هفتگی"] },
];

export function OperationsSection() {
  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="ops-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="ops-title" align="center" eyebrow="عملیات کسب‌وکار" title="سه حوزه، سه سیستم خودکار" />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {ops.map((op, i) => (
            <Reveal key={op.title} delay={i * 0.06}>
              <div className="card-glow h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white">
                  <op.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-semibold text-white">{op.title}</h3>
                <ol className="mt-3 space-y-2">
                  {op.steps.map((step, j) => (
                    <li key={step} className="flex items-center gap-2 text-sm text-white/85">
                      <span className="flex size-5 items-center justify-center rounded-full bg-accent/10 text-[0.6rem] font-bold text-accent">
                        {["۱", "۲", "۳"][j]}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

const manual = ["هر لید با دست ثبت می‌شود", "پیگیری‌ها فراموش می‌شوند", "پاسخ‌گویی فقط در ساعات کاری", "خطای انسانی در هر مرحله"];
const automated = ["ثبت لحظه‌ای از همه‌ی کانال‌ها", "پیگیری منظم و بدون فراموشی", "پاسخ ۲۴ ساعته", "اجرای یکسان و بدون خطا"];

export function ManualVsAutomatedSection() {
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="manual-vs-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="manual-vs-title" align="center" eyebrow="مقایسه" title="دستی در برابر خودکار" />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Reveal>
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/70">
                <X className="size-4" aria-hidden="true" /> دستی
              </span>
              <ul className="mt-5 space-y-3">
                {manual.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                    <X className="mt-0.5 size-4 shrink-0 text-white/30" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <span aria-hidden="true" className="mx-auto my-2 block rotate-90 md:my-0 md:rotate-0">
              <span className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white">
                <Zap className="size-5" />
              </span>
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 to-violet-500/10 p-7 shadow-[0_20px_50px_-28px_rgba(83,103,217,0.45)] backdrop-blur-sm">
              <span className="chip-gradient inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white">
                <Check className="size-4" aria-hidden="true" /> خودکار
              </span>
              <ul className="mt-5 space-y-3">
                {automated.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-white">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}