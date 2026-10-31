"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui/core";
import { cn, siteConfig, trackEvent } from "@/lib/site-config";
import { whyUsItems } from "@/data/content";

function WhyItem({ item, index }: { item: (typeof whyUsItems)[number]; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <li className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`why-panel-${index}`}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center gap-4 py-5 text-start"
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            open
              ? "bg-gradient-to-br from-accent to-violet-500 text-white shadow-[0_6px_16px_-6px_rgba(83,103,217,0.7)]"
              : "bg-white/5 text-accent group-hover:bg-accent/15"
          )}
        >
          <Plus className={cn("size-4 transition-transform duration-300", open && "rotate-45")} aria-hidden="true" />
        </span>
        <span className="font-semibold text-white">{item.title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`why-panel-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 pe-4 ps-[3.25rem] text-sm leading-7 text-white/60">{item.description}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

export function WhyUsSection() {
  return (
    <section className="relative bg-ink scroll-mt-24 py-20 md:py-28 overflow-hidden" aria-labelledby="why-us-title">
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      
      <Container className="relative z-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-28">
            <SectionHeading
              id="why-us-title"
              eyebrow="چرا ما"
              title="چرا عباس؟"
              description="ادعا نمی‌کنیم؛ روش‌مان را می‌گوییم. روی هر مورد کلیک کنید تا توضیح آن باز شود."
            />
          </Reveal>
        </div>

        <ul className="border-t border-white/10 lg:col-span-7">
          {whyUsItems.map((item, i) => (
            <WhyItem key={item.title} item={item} index={i} />
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="relative bg-ink py-20 md:py-28 overflow-hidden" aria-labelledby="cta-title">
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/40 via-ink to-ink" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 blur-[150px] rounded-full" />

      <Container className="relative z-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-accent/20 via-violet-600/10 to-ink/80 px-6 py-16 text-center md:px-16 md:py-20 backdrop-blur-sm">
            <div className="relative">
              <span className="chip-gradient shimmer inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-lg">
                شروع همکاری
              </span>
              <h2 id="cta-title" className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-[1.4] text-white md:text-5xl md:leading-[1.3]">
                برای رشد کسب‌وکارتان <span className="gradient-text-light">آماده‌اید؟</span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/80 md:text-base md:leading-9">
                بیایید ببینیم کدام بخش از کسب‌وکار شما می‌تواند با بازاریابی، هوش مصنوعی و اتوماسیون بهتر عمل کند.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  href={siteConfig.cta.contactHref}
                  size="lg"
                  onClickCapture={() => trackEvent("cta_click", { location: "cta_band" })}
                >
                  درخواست مشاوره
                  <ArrowLeft className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}