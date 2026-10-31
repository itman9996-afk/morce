"use client";

/**
 * پس‌زمینه‌ی تعاملی سایت — واکنش‌گرا به موس، کاملاً بهینه:
 *  - شبکه‌های خطی با عمق متفاوت (پارالاکس) + هاشورهای متغیر الزاویه + Glow دنبال‌کننده‌ی موس + نقاط واکنش‌گرا
 *  - همه‌ی به‌روزرسانی‌ها با transform در یک حلقه‌ی rAF — بدون re-render ریکات
 *  - prefers-reduced-motion → کاملاً ثابت؛ دستگاه‌های لمسی → فقط پارالاکس اسکرول
 */
import { useEffect, useRef } from "react";

const DOTS: Array<{ x: number; y: number }> = [
  { x: 12, y: 18 }, { x: 78, y: 12 }, { x: 88, y: 42 }, { x: 65, y: 30 },
  { x: 22, y: 55 }, { x: 45, y: 70 }, { x: 82, y: 78 }, { x: 15, y: 82 },
  { x: 55, y: 15 }, { x: 35, y: 35 }, { x: 70, y: 60 }, { x: 8, y: 40 },
  { x: 92, y: 65 }, { x: 40, y: 88 },
];

const REACH = 220; // شعاع واکنش نقاط به موس (px)
const GLOW_HALF = 260;

export function InteractiveBackground() {
  const gridCoarseRef = useRef<HTMLDivElement>(null);
  const gridFineRef = useRef<HTMLDivElement>(null);
  const hatchARef = useRef<HTMLDivElement>(null);
  const hatchBRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const target = { x: 0.5, y: 0.5 };
    const cur = { x: 0.5, y: 0.5 };
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let lastMove = -10000;
    let raf = 0;

    const dotBase: Array<{ bx: number; by: number }> = DOTS.map((d) => ({
      bx: (d.x / 100) * vw,
      by: (d.y / 100) * vh,
    }));

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      DOTS.forEach((d, i) => {
        dotBase[i].bx = (d.x / 100) * vw;
        dotBase[i].by = (d.y / 100) * vh;
      });
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / vw;
      target.y = e.clientY / vh;
      lastMove = performance.now();
    };

    const onLeaveDoc = () => {
      lastMove = -10000;
    };

    if (finePointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeaveDoc);
    }
    window.addEventListener("resize", onResize, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;

      cur.x = lerp(cur.x, target.x, 0.08);
      cur.y = lerp(cur.y, target.y, 0.08);

      const px = cur.x * vw;
      const py = cur.y * vh;
      const sy = window.scrollY;
      const dx = cur.x - 0.5;
      const dy = cur.y - 0.5;

      if (gridCoarseRef.current) {
        gridCoarseRef.current.style.transform = `translate3d(${(dx * -26).toFixed(1)}px, ${(dy * -18 + sy * 0.05).toFixed(1)}px, 0)`;
      }
      if (gridFineRef.current) {
        gridFineRef.current.style.transform = `translate3d(${(dx * -13).toFixed(1)}px, ${(dy * -9 + sy * 0.025).toFixed(1)}px, 0)`;
      }
      if (hatchARef.current) {
        hatchARef.current.style.transform = `rotate(${(dx * 3).toFixed(2)}deg) translate3d(${(dx * -20).toFixed(1)}px, 0, 0)`;
      }
      if (hatchBRef.current) {
        hatchBRef.current.style.transform = `rotate(${(-(dy * 3.5)).toFixed(2)}deg)`;
      }
      if (glowRef.current) {
        const idle = performance.now() - lastMove > 2400;
        glowRef.current.style.opacity = idle ? "0" : "1";
        glowRef.current.style.transform = `translate3d(${(px - GLOW_HALF).toFixed(1)}px, ${(py - GLOW_HALF).toFixed(1)}px, 0)`;
      }

      const now = performance.now();
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        if (!dot) continue;
        const b = dotBase[i];
        const dist = Math.hypot(b.bx - px, b.by - py);
        const influence = Math.max(0, 1 - dist / REACH);
        const scale = 1 + influence * 1.7;
        const opacity = 0.28 + influence * 0.7;
        dot.style.transform = `scale(${scale.toFixed(2)})`;
        dot.style.opacity = opacity.toFixed(2);
      }
      void now;
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (finePointer) {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      }
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="bg-mesh pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* شبکه‌ی درشت — عمق دور */}
      <div
        ref={gridCoarseRef}
        className="absolute -inset-16 will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(83,103,217,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(83,103,217,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* شبکه‌ی ریز — عمق نزدیک */}
      <div
        ref={gridFineRef}
        className="absolute -inset-16 will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(124,93,240,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,93,240,0.05) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* هاشورهای مورب — زاویه با موس تغییر می‌کند */}
      <div ref={hatchARef} className="hatch-a absolute -inset-28 will-change-transform" />
      <div ref={hatchBRef} className="hatch-b absolute -inset-28 will-change-transform" />

      {/* نقاط واکنش‌گرا */}
      {DOTS.map((d, i) => (
        <span
          key={i}
          ref={(el) => {
            dotsRef.current[i] = el;
          }}
          className="reactive-dot"
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
        />
      ))}

      {/* Glow دنبال‌کننده‌ی موس */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          width: GLOW_HALF * 2,
          height: GLOW_HALF * 2,
          background:
            "radial-gradient(circle, rgba(83,103,217,0.14) 0%, rgba(124,93,240,0.07) 42%, transparent 70%)",
        }}
      />
    </div>
  );
}