"use client";

import { useState } from "react";
import Image from "next/image";
import { BarChart3, Camera, Clapperboard, FileText, Lightbulb, Palette, Repeat2, Scissors, Smartphone, UserRound, type LucideIcon } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { SiteImage } from "@/components/ui/site-image";
import { FlowLine } from "@/components/sections/service-shared";
import { cn } from "@/lib/site-config";

const ecosystem: Array<{ file: string; title: string; en: string; desc: string; Icon: LucideIcon }> = [
  { file: "content-reels", title: "ریلز", en: "REELS", desc: "کوتاه، سریع و نگاه‌داشتنی برای اینستاگرام.", Icon: Smartphone },
  { file: "content-video-production", title: "ویدیو", en: "VIDEO", desc: "از معرفی محصول تا ویدیوی تبلیغاتی کامل.", Icon: Clapperboard },
  { file: "content-photography", title: "عکس", en: "PHOTO", desc: "عکس محصول و بصری‌های کمپین.", Icon: Camera },
  { file: "content-ugc", title: "UGC", en: "USER CONTENT", desc: "محتوای کاربرمحور اعتمادساز.", Icon: UserRound },
];

export function ContentEcosystemSection() {
  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="ecosystem-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="ecosystem-title" align="center" eyebrow="اکوسیستم محتوا" title="چهار نوع محتوا، یک هویت برند" description="هر فرمت برای هدفی ساخته می‌شود؛ ترکیب درست آن‌ها است که برند را می‌سازد." />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ecosystem.map((item, i) => (
            <Reveal key={item.file} delay={i * 0.06}>
              <figure className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <SiteImage asset={{ src: `/images/${item.file}.webp`, alt: `${item.title} — تولید محتوا` }} className="aspect-[4/5] rounded-none border-0" sizes="(min-width: 1024px) 25vw, 50vw" />
                <figcaption className="p-5">
                  <span className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                    <item.Icon className="size-4 text-accent" aria-hidden="true" />
                  </span>
                  <span className="mt-0.5 block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accent">{item.en}</span>
                  <span className="mt-2 block text-xs leading-6 text-white/70">{item.desc}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CompareImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-accent/10 via-ink to-accent/5", className)}>
        <span aria-hidden="true" className="grid-pattern absolute inset-0 opacity-60" />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 60vw, 100vw" onError={() => setFailed(true)} className="object-cover" />
    </div>
  );
}

export function BeforeAfterSection() {
  const [pos, setPos] = useState(50);
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="before-after-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[150px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="before-after-title" align="center" eyebrow="قبل و بعد" title="تفاوت را با دست خودتان ببینید" description="دستگیره را بکشید: سمت راست محتوای خام، سمت چپ خروجی نهایی پس از تدوین و تقویت هوشمند." />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="relative mx-auto mt-12 aspect-[16/10] max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/10 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)] bg-ink">
            <CompareImage src="/images/content-after.webp" alt="محتوای نهایی" className="absolute inset-0" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <CompareImage src="/images/content-before.webp" alt="محتوای خام" className="absolute inset-y-0 right-0 h-full" />
            </div>
            <span aria-hidden="true" className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]" style={{ right: `${pos}%` }} />
            <span className="absolute right-3 top-3 z-10 rounded-full bg-ink/70 px-3 py-1 text-xs text-white backdrop-blur-sm">خام</span>
            <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">نهایی</span>
            <label className="sr-only" htmlFor="compare-range">مقایسه‌ی قبل و بعد</label>
            <input id="compare-range" type="range" min={5} max={95} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

const aiRoles: Array<[LucideIcon, string, string]> = [
  [Lightbulb, "ایده‌پردازی", "ایده بر اساس ترند و مخاطب"],
  [FileText, "سناریو", "متن و ساختار روایت"],
  [Palette, "راهبری بصری", "رنگ، نور و سبک برند"],
  [Scissors, "تدوین", "برش، ریتم و موشن"],
  [Repeat2, "بازنشر", "یک محتوا، چند پلتفرم"],
  [BarChart3, "تحلیل", "چه چیزی جواب داد؟"],
];

export function AIInContentSection() {
  return (
    <section className="relative bg-ink py-16 md:py-24 overflow-hidden" aria-labelledby="ai-in-content-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="ai-in-content-title" align="center" eyebrow="نقش AI" title="هوش مصنوعی دقیقاً کجای تولید محتوا است؟" description="AI جای خلاقیت انسان را نمی‌گیرد؛ سرعت و دقت هر مرحله را چند برابر می‌کند." />
        </Reveal>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aiRoles.map(([Icon, title, desc], i) => (
            <Reveal key={title} delay={i * 0.05}>
              <li className="card-glow flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-white">{title}</span>
                  <span className="mt-0.5 block text-xs leading-6 text-white/70">{desc}</span>
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

const factory: Array<[string, string]> = [
  ["استراتژی", "هدف، مخاطب و پیام کلیدی"],
  ["خلق ایده", "کانسپت و هوک هر محتوا"],
  ["تولید", "ضبط با کیفیت استودیویی"],
  ["تدوین", "برش، گرافیک و صدا"],
  ["انتشار", "تقویم منظم در پلتفرم‌ها"],
  ["تحلیل", "بهینه‌سازی محتوای بعدی"],
];

export function ContentFactorySection() {
  return (
    <section className="relative bg-ink border-y border-white/10 py-16 md:py-24 overflow-hidden" aria-labelledby="factory-title">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading id="factory-title" align="center" eyebrow="کارخانه‌ی محتوا" title="تولید محتوا یک خط تولید است، نه اتفاق" description="هر محتوا از همین شش ایستگاه عبور می‌کند؛ نتیجه‌اش نظم، سرعت و کیفیت تکرارپذیر است." />
        </Reveal>
        <ol className="mx-auto mt-12 max-w-2xl">
          {factory.map(([title, desc], i) => (
            <li key={title}>
              <Reveal delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-sm font-black text-white">
                    {String(i + 1).padStart(2, "۰")}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{title}</span>
                    <span className="block text-xs leading-6 text-white/70">{desc}</span>
                  </span>
                </div>
              </Reveal>
              {i < factory.length - 1 ? <div className="my-1"><FlowLine vertical /></div> : null}
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}