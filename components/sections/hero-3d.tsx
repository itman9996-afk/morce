"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowLeft, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/core";
import { siteConfig, trackEvent } from "@/lib/site-config";

// three.js فقط سمت کلاینت و بعد از لود اولیه‌ی صفحه بارگذاری می‌شود
const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => null }
);

const SHADOW = "[text-shadow:0_2px_28px_rgba(0,0,0,0.85)]";

/** تیتر اصلی + دکمه‌ها — هم در حالت 3D و هم در حالت ساده استفاده می‌شود */
function HeroIntro() {
  return (
    <div className={`container-site text-center ${SHADOW}`}>
      <span className="chip-gradient inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white">
        بازاریابی + هوش مصنوعی + اتوماسیون
      </span>
      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.35] text-white sm:text-5xl lg:text-6xl lg:leading-[1.2]">
        کسب‌وکار خود را <span className="gradient-text-light">هوشمندتر</span> رشد دهید
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg md:leading-9">
        از بازاریابی و تولید محتوا تا هوش مصنوعی و اتوماسیون؛ راهکارهایی می‌سازیم که به کسب‌وکار شما
        کمک می‌کنند بهتر دیده شود، بیشتر بفروشد و هوشمندتر رشد کند.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          href="/contact"
          size="lg"
          onClickCapture={() => trackEvent("cta_click", { location: "hero_3d_primary" })}
        >
          {siteConfig.cta.heroPrimary}
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button href="/#services" variant="outline" size="lg">
          {siteConfig.cta.heroSecondary}
        </Button>
      </div>
    </div>
  );
}

/**
 * یک متن که در بازه‌ی [from, to] از اسکرول ظاهر می‌شود.
 * wrapper برای جایگاه است و motion.div برای انیمیشن (تا transform های Tailwind و framer با هم تداخل نکنند).
 */
function Caption({
  progress,
  from,
  to,
  pos,
  first = false,
  hold = false,
  children,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  pos: string;
  first?: boolean;
  hold?: boolean;
  children: ReactNode;
}) {
  const fade = 0.04;
  const input = first ? [0, to - fade, to] : [from, from + fade, to - fade, to];
  const opacity = useTransform(
    progress,
    input,
    first ? [1, 1, 0] : hold ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    input,
    first ? [0, 0, -30] : hold ? [30, 0, 0, 0] : [30, 0, 0, -30]
  );
  const pointerEvents = useTransform(
    opacity,
    (o) => (o > 0.5 ? "auto" : "none") as "auto" | "none"
  );

  return (
    <div className={`pointer-events-none absolute ${pos}`}>
      <motion.div style={{ opacity, y, pointerEvents }}>{children}</motion.div>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="mb-3 block text-xs tracking-wide text-[#8FD3FF]">{children}</span>;
}

function FlightCaptions({ progress }: { progress: MotionValue<number> }) {
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);
  const side = "inset-x-5 bottom-[12%] md:inset-x-auto md:w-[26rem]";

  return (
    <div className={`absolute inset-0 z-20 ${SHADOW}`}>
      <Caption progress={progress} from={0} to={0.17} first pos="inset-0 flex items-center justify-center px-4">
        <HeroIntro />
      </Caption>

      <Caption progress={progress} from={0.22} to={0.4} pos={`${side} md:bottom-auto md:right-[7%] md:top-1/2 md:-translate-y-1/2`}>
        <Tag>۰۱ — بازاریابی</Tag>
        <h2 className="text-2xl font-bold leading-[1.5] text-white md:text-3xl">بازاریابی داده‌محور</h2>
        <p className="mt-3 text-sm leading-7 text-white/75">
          کمپین‌هایی که با داده ساخته می‌شوند و با داده بهینه می‌شوند، نه با حدس.
        </p>
      </Caption>

      <Caption progress={progress} from={0.44} to={0.62} pos={`${side} md:bottom-[16%] md:left-[7%]`}>
        <Tag>۰۲ — محتوا</Tag>
        <h2 className="text-2xl font-bold leading-[1.5] text-white md:text-3xl">محتوای سریع‌تر، با کیفیت ثابت</h2>
        <p className="mt-3 text-sm leading-7 text-white/75">
          هوش مصنوعی تولید را سریع می‌کند و تیم ما کیفیت و لحن برند شما را نگه می‌دارد.
        </p>
      </Caption>

      <Caption progress={progress} from={0.66} to={0.83} pos={`${side} md:bottom-auto md:right-[7%] md:top-[30%]`}>
        <Tag>۰۳ — هوش مصنوعی و اتوماسیون</Tag>
        <h2 className="text-2xl font-bold leading-[1.5] text-white md:text-3xl">کارهای تکراری را به سیستم بسپارید</h2>
        <p className="mt-3 text-sm leading-7 text-white/75">
          پیگیری مشتری، ارسال پیام و گزارش‌گیری خودکار می‌شود تا تیم شما روی رشد تمرکز کند.
        </p>
      </Caption>

      <Caption progress={progress} from={0.87} to={1} hold pos="inset-0 flex items-center justify-center px-4 text-center">
        <div className="max-w-2xl">
          <Tag>۰۴ — رشد</Tag>
          <h2 className="text-3xl font-bold leading-[1.45] text-white md:text-5xl">
            آماده‌اید سیستم رشد خود را بسازید؟
          </h2>
          <div className="mt-8 flex justify-center">
            <Button
              href="/contact"
              size="lg"
              onClickCapture={() => trackEvent("cta_click", { location: "hero_flight_end" })}
            >
              {siteConfig.cta.heroPrimary}
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </Caption>

      <motion.div
        style={{ opacity: hintOpacity }}
        className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/60"
      >
        <span className="text-xs tracking-wide">اسکرول کنید</span>
        <ArrowDown className="size-4 motion-safe:animate-bounce" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

export function Hero3DExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [enable3d, setEnable3d] = useState(false);
  const [lite, setLite] = useState(false);
  const [inView, setInView] = useState(true);

  // فقط وقتی کاربر حرکت کم نخواسته و WebGL دارد، پرواز سه‌بعدی فعال شود
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hasWebGL = false;
    try {
      const c = document.createElement("canvas");
      hasWebGL = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      hasWebGL = false;
    }
    setLite(window.innerWidth < 768);
    setEnable3d(!reduced && hasWebGL);
  }, []);

  // وقتی Hero از دید خارج شد رندر متوقف شود
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // پیشرفت اسکرول فقط در محدوده‌ی همین Hero (۰ تا ۱)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      aria-label="معرفی"
      className={
        enable3d
          ? "relative h-[450vh] w-full bg-ink md:h-[600vh]"
          : "relative min-h-[100svh] w-full overflow-hidden bg-ink"
      }
    >
      <div
        className={
          enable3d
            ? "sticky top-0 h-[100svh] w-full overflow-hidden"
            : "relative min-h-[100svh] w-full overflow-hidden"
        }
      >
        {/* پس‌زمینه‌ی ثابت — fallback وقتی 3D غیرفعال است */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-purple-950/30 to-ink" />
          <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-[#5367D9]/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        {enable3d ? (
          <>
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <HeroScene progress={scrollYProgress} active={inView} lite={lite} eventSource={sectionRef} />
            </div>
            {/* گرادیان‌های ملایم برای خوانایی متن */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/80 to-transparent" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden="true" />
            <FlightCaptions progress={scrollYProgress} />
          </>
        ) : (
          <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-4">
            <HeroIntro />
          </div>
        )}
      </div>
    </section>
  );
}
