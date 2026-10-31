"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/core";
import { siteConfig, trackEvent } from "@/lib/site-config";

const VIDEO_DESKTOP = "/videos/hero.mp4";
const VIDEO_MOBILE = "/videos/hero-mobile.mp4";
const VIDEO_POSTER = "/videos/hero-poster.jpg"; // مطمئن شو این فایل وجود داره
const LOAD_TIMEOUT_MS = 20000;
const LERP_FACTOR = 0.18;
const SEEK_THRESHOLD = 0.033;

const log = (...args: unknown[]) => console.log("[HeroVideo]", ...args);

export function HeroVideoExperience() {
  const [mode, setMode] = useState<"video" | "static">("video");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("static");
    }
  }, []);

  if (mode === "static") return <StaticHero />;

  return <ScrollVideoHero onFatalError={() => setMode("static")} />;
}

function StaticHero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="animated-grid absolute inset-0 opacity-70" />
      <div aria-hidden="true" className="blob -top-24 start-[-8%] size-96" />
      <div aria-hidden="true" className="blob -bottom-32 end-[-6%] size-[26rem]" />
      <div className="container-site relative py-20 text-center md:py-28">
        <span className="chip-gradient inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white">
          بازاریابی + هوش مصنوعی + اتوماسیون
        </span>
        <h1 id="hero-title" className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.35] sm:text-5xl lg:text-[3.4rem] lg:leading-[1.3]">
          کسب‌وکار خود را <span className="gradient-text">هوشمندتر</span> رشد دهید.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg md:leading-9">
          از بازاریابی و تولید محتوا تا هوش مصنوعی و اتوماسیون؛ راهکارهایی می‌سازیم که به کسب‌وکار شما کمک می‌کنند بهتر دیده شود، بیشتر بفروشد و هوشمندتر رشد کند.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" size="lg">
            {siteConfig.cta.heroPrimary}
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Button>
          <Button href="/services" variant="outline" size="lg">
            {siteConfig.cta.heroSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ScrollVideoHero({ onFatalError }: { onFatalError: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const inView = useRef(true);
  const gotFrame = useRef(false);
  const target = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    video.dataset.source = isMobile ? "mobile" : "desktop";
    video.src = isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP;
    video.load();
    video.pause();
  }, []);

  const fail = (reason: string) => {
    console.warn(`[HeroVideo] ${reason}`);
    onFatalError();
  };

  const handleSourceError = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.dataset.source === "mobile" && video.dataset.retried !== "1") {
      video.dataset.retried = "1";
      video.src = VIDEO_DESKTOP;
      video.load();
      video.pause();
      return;
    }
    fail("ERROR: لود ویدیو ناموفق");
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (!gotFrame.current) {
        const v = videoRef.current;
        fail(`TIMEOUT: ظرف ۲۰ ثانیه فریمی رندر نشد`);
      }
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => { inView.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    
    const getProgress = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 0;
      const p = -rect.top / total;
      return Math.min(1, Math.max(0, p));
    };
    
    target.current = getProgress();
    const onScroll = () => { target.current = getProgress(); };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    let raf = 0;
    let current = target.current;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || !inView.current || video.readyState < 2) return;

      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const diff = target.current - current;
      if (Math.abs(diff) > 0.0004) current += diff * LERP_FACTOR;

      const time = Math.min(Math.max(0, current * duration), duration - 0.001);
      if (Math.abs(video.currentTime - time) > SEEK_THRESHOLD) {
        try { video.currentTime = time; } catch {}
      }

      if (textRef.current) {
        const fade = Math.min(1, Math.max(0, 1 - current / 0.16));
        textRef.current.style.opacity = String(fade);
        textRef.current.style.transform = `translateY(${((1 - fade) * -20).toFixed(1)}px)`;
        textRef.current.style.visibility = fade <= 0.01 ? "hidden" : "visible";
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    // ارتفاع زیاد برای ایجاد فضای اسکرول
    <section ref={sectionRef} data-video-hero className="relative h-[300svh] w-full" aria-label="معرفی">
      
      {/* 🔴 تغییر کلیدی: به جای top-0 از top-24 استفاده شد تا دقیقاً زیر هدر قفل شود و تداخل نداشته باشد */}
      <div className="sticky top-24 h-[100svh] w-full overflow-hidden bg-ink z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          poster={VIDEO_POSTER}
          onLoadedData={(e) => {
            try { e.currentTarget.currentTime = 0.001; e.currentTarget.pause(); } catch {}
          }}
          onCanPlay={() => { gotFrame.current = true; setReady(true); }}
          onError={handleSourceError}
          tabIndex={-1}
          aria-hidden="true"
        />
        
        {/* لایه تاریک روی ویدیو برای خوانایی بهتر متن */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/40" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/80 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/90 to-transparent" />
        
        <div ref={textRef} className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="container-site w-full text-center">
            <span className="chip-gradient shimmer inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-lg">
              بازاریابی + هوش مصنوعی + اتوماسیون
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-[1.4] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.5)] sm:text-4xl lg:text-5xl lg:leading-[1.3]">
              کسب‌وکار خود را <span className="gradient-text-light">هوشمندتر</span> رشد دهید.
            </h1>
            <p className="mx-auto mt-4 hidden max-w-2xl text-base leading-8 text-white/85 [text-shadow:0_1px_18px_rgba(0,0,0,0.55)] md:block md:text-lg md:leading-9">
              از بازاریابی و تولید محتوا تا هوش مصنوعی و اتوماسیون؛ راهکارهایی می‌سازیم که بهتر دیده شوید، بیشتر بفروشید و هوشمندتر رشد کنید.
            </p>
            <div className="pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button href="/contact" size="lg" onClickCapture={() => trackEvent("cta_click", { location: "hero_video_primary" })}>
                {siteConfig.cta.heroPrimary}
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Button>
              <Button href="/services" variant="white" size="lg">
                {siteConfig.cta.heroSecondary}
              </Button>
            </div>
          </div>
        </div>

        {!ready ? (
          <div className="pointer-events-none absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-ink/60 px-4 py-2 text-xs text-white/80 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            در حال آماده‌سازی…
          </div>
        ) : null}
      </div>
    </section>
  );
}