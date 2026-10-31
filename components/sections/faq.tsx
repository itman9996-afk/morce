"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { cn } from "@/lib/site-config";

const faqs = [
  { q: "آیا خدمات شما برای کسب‌وکارهای کوچک هم مناسب است؟", a: "بله، ما راهکارها را دقیقاً بر اساس بودجه، اندازه و اهداف کسب‌وکار شما طراحی می‌کنیم." },
  { q: "فرایند شروع همکاری چگونه است؟", a: "ابتدا یک جلسه شناخت رایگان داریم، سپس استراتژی اختصاصی شما طراحی و برای تایید ارسال می‌شود." },
  { q: "آیا تضمینی برای نتیجه وجود دارد؟", a: "ما بر اساس داده‌ها و روش‌های اثبات‌شده کار می‌کنیم و شاخص‌های کلیدی عملکرد (KPI) را از روز اول شفاف می‌کنیم." },
  { q: "مدت زمان اجرای پروژه‌ها چقدر است؟", a: "بسته به پیچیدگی پروژه، از ۲ هفته تا ۳ ماه متغیر است، اما نتایج اولیه معمولاً در ماه اول قابل مشاهده هستند." }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative bg-ink py-20 md:py-28 overflow-hidden">
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading align="center" eyebrow="سوالات متداول" title="پاسخ به پرسش‌های شما" description="اگر پاسخ سوال خود را پیدا نکردید، با ما تماس بگیرید." />
        </Reveal>
        <div className="mx-auto mt-12 max-w-3xl">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="border-b border-white/10">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-start">
                  <span className="font-semibold text-white">{faq.q}</span>
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent transition-transform duration-300", openIndex === i && "rotate-45 bg-accent text-white")}>
                    <Plus className="size-5" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="pb-5 text-sm leading-7 text-white/60">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}