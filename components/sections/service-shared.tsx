"use client";

/**
 * اجزای مشترک صفحات خدمت:
 *  - ServiceVideoHero: هیرو با ویدیوی اختصاصی هر خدمت + جریان کار
 *  - VideoPanel: پخش‌کننده‌ی سبک (muted/loop/playsInline، preload سبک، جای‌گیر)
 *  - FlowLine: خط جریان نقطه‌چین متحرک (با keyframe موجود dots-pan — بدون CSS جدید)
 */
import { useState } from "react";
import { ArrowLeft, Film } from "lucide-react";
import { Button, Reveal } from "@/components/ui/core";
import { cn } from "@/lib/site-config";

export function FlowLine({
  vertical = false,
  className,
}: {
  vertical?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("block shrink-0", vertical ? "mx-auto h-10 w-px" : "mx-1 h-px min-w-6 flex-1", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(83,103,217,0.55) 1.5px, transparent 1.6px)",
        backgroundSize: vertical ? "2px 8px" : "8px 2px",
        animation: "dots-pan 2.4s linear infinite",
      }}
    />
  );
}

export function VideoPanel({
  src,
  poster,
  title,
  className,
}: {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={title}
        className={cn(
          "relative flex aspect-video items-center justify-center overflow-hidden rounded-[1.5rem] border border-line bg-gradient-to-br from-accent-soft via-background to-accent-soft/60",
          className
        )}
      >
        <span aria-hidden="true" className="grid-pattern absolute inset-0 opacity-60" />
        <span className="relative flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted">
          <Film className="size-4 text-accent" aria-hidden="true" />
          ویدیوی معرفی به‌زودی
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-[1.5rem] border border-line bg-ink shadow-[0_30px_70px_-30px_rgba(32,37,43,0.4)]",
        className
      )}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        aria-label={title}
      />
    </div>
  );
}

interface ServiceVideoHeroProps {
  label: string;
  title: string;
  description: string;
  videoSrc: string;
  posterSrc?: string;
  videoTitle: string;
  flow: string[];
  band?: string;
  contactHref: string;
  contactLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export function ServiceVideoHero({
  label,
  title,
  description,
  videoSrc,
  posterSrc,
  videoTitle,
  flow,
  band,
  contactHref,
  contactLabel,
  secondaryHref,
  secondaryLabel,
}: ServiceVideoHeroProps) {
  return (
    <section className={cn("border-b border-line py-14 md:py-20", band)} aria-labelledby="service-hero-title">
      <div className="container-site grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="chip-gradient inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white">
              {label}
            </span>
            <h1 id="service-hero-title" className="mt-4 text-3xl font-bold leading-[1.35] md:text-5xl md:leading-[1.3]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted md:text-lg md:leading-9">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={contactHref}>
                {contactLabel}
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Button>
              <Button href={secondaryHref} variant="outline">
                {secondaryLabel}
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08} className="lg:col-span-6">
          <VideoPanel src={videoSrc} poster={posterSrc} title={videoTitle} />
          <ul aria-label="جریان کار این خدمت" className="mt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
            {flow.map((step, i) => (
              <li key={step} className="flex items-center gap-1">
                <span className="rounded-full border border-line bg-white/85 px-3 py-1 text-xs font-medium text-ink/85">
                  {step}
                </span>
                {i < flow.length - 1 ? (
                  <ArrowLeft className="size-3.5 text-accent/70" aria-hidden="true" />
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}