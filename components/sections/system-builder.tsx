"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, BarChart3, BrainCircuit, Camera, Clapperboard, Megaphone, MessagesSquare, RefreshCcw, RotateCcw, Smartphone, Target, TrendingUp, Workflow, type LucideIcon } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { cn } from "@/lib/site-config";

interface BuilderOption {
  id: string;
  label: string;
  cat: "تولید محتوا" | "هوش مصنوعی" | "اتوماسیون" | "دیجیتال مارکتینگ";
  Icon: LucideIcon;
}

const options: BuilderOption[] = [
  { id: "reels", label: "ریلز", cat: "تولید محتوا", Icon: Smartphone },
  { id: "video", label: "ویدیوی تبلیغاتی", cat: "تولید محتوا", Icon: Clapperboard },
  { id: "photo", label: "عکس محصول", cat: "تولید محتوا", Icon: Camera },
  { id: "chatbot", label: "چت‌بات", cat: "هوش مصنوعی", Icon: MessagesSquare },
  { id: "agent", label: "ایجنت هوشمند", cat: "هوش مصنوعی", Icon: BrainCircuit },
  { id: "aisales", label: "فروش هوشمند", cat: "هوش مصنوعی", Icon: TrendingUp },
  { id: "n8n", label: "n8n", cat: "اتوماسیون", Icon: Workflow },
  { id: "followup", label: "پیگیری خودکار", cat: "اتوماسیون", Icon: RefreshCcw },
  { id: "ads", label: "تبلیغات", cat: "دیجیتال مارکتینگ", Icon: Megaphone },
  { id: "analytics", label: "تحلیل و گزارش", cat: "دیجیتال مارکتینگ", Icon: BarChart3 },
  { id: "retarget", label: "ریتارگتینگ", cat: "دیجیتال مارکتینگ", Icon: Target },
];

function levelLabel(count: number): { title: string; hint: string } {
  if (count === 0) return { title: "سیستم خاموش است", hint: "یک گزینه انتخاب کن تا روشن شود 👆" };
  if (count <= 2) return { title: "جرقه‌ی اول روشن شد!", hint: "چند قطعه‌ی دیگر کم داری…" };
  if (count <= 4) return { title: "سیستم دارد جان می‌گیرد", hint: "داره جدی می‌شه!" };
  if (count <= 6) return { title: "سیستم جدی‌ای داری", hint: "این نقشه می‌تواند کار تیم را نصف کند." };
  return { title: "غول رشد!", hint: "این نقشه ارزش یک جلسه‌ی مشاوره را دارد." };
}

export function SystemBuilderSection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chosen = useMemo(() => options.filter((o) => selected.has(o.id)), [selected]);
  const cats = useMemo(() => Array.from(new Set(chosen.map((o) => o.cat))), [chosen]);
  const level = levelLabel(chosen.length);
  const contactHref = chosen.length > 0 ? `/contact?interest=${encodeURIComponent(cats.join("|"))}&items=${encodeURIComponent(chosen.map((o) => o.label).join("|"))}` : "/contact";

  return (
    <section className="relative bg-ink py-20 md:py-28 overflow-hidden">
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full" />

      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="builder-hero-title" align="center" eyebrow="بازی‌کن و بساز" title="سیستم رشد خودت را همین‌جا بساز" description="گزینه‌هایی که کسب‌وکارتان لازم دارد را روشن کن؛ ببین سیستم‌تان زنده چه شکلی می‌شود." />
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl items-start gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ul className="flex flex-wrap gap-2.5" aria-label="گزینه‌های سیستم">
              {options.map((opt) => {
                const active = selected.has(opt.id);
                return (
                  <li key={opt.id}>
                    <button type="button" aria-pressed={active} onClick={() => toggle(opt.id)} className={cn("flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all duration-200 active:scale-95", active ? "border-transparent bg-gradient-to-l from-accent to-violet-500 font-semibold text-white shadow-[0_10px_26px_-10px_rgba(83,103,217,0.65)]" : "border-white/10 bg-white/5 text-white/70 hover:border-accent/50 hover:text-accent")}>
                      <opt.Icon className={cn("size-4", active ? "text-white" : "text-accent")} aria-hidden="true" />
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
            {chosen.length > 0 && (
              <button type="button" onClick={() => setSelected(new Set())} className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-accent">
                <RotateCcw className="size-3.5" aria-hidden="true" /> پاک کردن همه
              </button>
            )}
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-center shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
              <div className="relative mx-auto flex size-28 items-center justify-center">
                {chosen.length > 0 && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-accent/20" />}
                <span className={cn("relative flex size-24 items-center justify-center rounded-full text-white transition-all duration-300", chosen.length > 0 ? "bg-gradient-to-br from-accent to-violet-500 shadow-[0_16px_40px_-14px_rgba(83,103,217,0.7)]" : "bg-white/10")}>
                  <span className="text-center">
                    <span className="block text-2xl font-black">{chosen.length}</span>
                    <span className="block text-[0.6rem] opacity-80">قطعه فعال</span>
                  </span>
                </span>
              </div>
              <p className="mt-4 text-lg font-bold text-white">{level.title}</p>
              <p className="mt-1 text-xs leading-6 text-white/60">{level.hint}</p>
              <div className="mt-4 flex justify-center gap-1" aria-hidden="true">
                {options.map((_, i) => (
                  <span key={i} className={cn("h-1.5 w-3.5 rounded-full transition-colors duration-300", i < chosen.length ? "bg-gradient-to-l from-accent to-violet-500" : "bg-white/10")} />
                ))}
              </div>
              {chosen.length > 0 && (
                <ul className="mt-4 flex flex-wrap justify-center gap-1.5" aria-label="قطعه‌های انتخاب‌شده">
                  {chosen.map((o) => <li key={o.id} className="rounded-full bg-accent/10 px-3 py-1 text-[0.65rem] font-semibold text-accent">{o.label}</li>)}
                </ul>
              )}
              <a href={contactHref} className="btn-gradient mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-white shadow-[0_8px_24px_-10px_rgba(83,103,217,0.65)] transition-shadow hover:shadow-[0_12px_32px_-10px_rgba(83,103,217,0.75)]">
                {chosen.length > 0 ? "دریافت مشاوره برای همین سیستم" : "مشاوره رایگان"}
                <ArrowLeft className="size-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}