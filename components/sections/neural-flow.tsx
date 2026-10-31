"use client";

/**
 * «جریان داده‌ی عصبی» — انیمیشن وابسته به اسکرول (Scrollytelling)
 *
 * یک مسیر نوری از بالا تا پایین بخش کشیده می‌شود. یک گره‌ی درخشان با اسکرول روی مسیر
 * حرکت می‌کند و هر ایستگاه که به آن می‌رسد روشن می‌شود و کارتش وارد صحنه می‌شود.
 * موس روی کارت‌ها اثر سه‌بعدی (tilt) می‌دهد.
 *
 * بدون وابستگی جدید: فقط framer-motion و lucide-react که از قبل در پروژه هست.
 */
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Database, Cpu, Workflow, TrendingUp, type LucideIcon } from "lucide-react";

type Station = {
  icon: LucideIcon;
  tag: string;
  title: string;
  text: string;
};

const STATIONS: Station[] = [
  {
    icon: Database,
    tag: "۰۱ — ورودی",
    title: "دریافت و یکپارچه‌سازی داده",
    text: "داده‌های سایت، تبلیغات، CRM و پیام‌رسان‌ها را در یک جریان واحد جمع می‌کنیم.",
  },
  {
    icon: Cpu,
    tag: "۰۲ — پردازش",
    title: "تحلیل با هوش مصنوعی",
    text: "مدل‌ها الگوهای رفتار مشتری را پیدا می‌کنند و بهترین فرصت‌ها را پیشنهاد می‌دهند.",
  },
  {
    icon: Workflow,
    tag: "۰۳ — اجرا",
    title: "اتوماسیون هوشمند",
    text: "پیگیری مشتری، ارسال پیام و گزارش‌گیری بدون دخالت دستی انجام می‌شود.",
  },
  {
    icon: TrendingUp,
    tag: "۰۴ — نتیجه",
    title: "رشد قابل اندازه‌گیری",
    text: "هر مرحله در داشبورد قابل پیگیری است تا ببینید دقیقاً رشد از کجا آمده است.",
  },
];

// مختصات به درصد (viewBox = 0..100). ۴ نقطه‌ی میانی = ایستگاه‌ها
type Pt = [number, number];
const DESKTOP_PTS: Pt[] = [[50, 0], [30, 12], [70, 37], [30, 62], [70, 87], [50, 100]];
const MOBILE_PTS: Pt[] = [[92, 0], [92, 12], [92, 37], [92, 62], [92, 87], [92, 100]];

/** منحنی S نرم با مماس عمودی در هر نقطه */
function buildPath(pts: Pt[]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const my = (y1 + y2) / 2;
    d += ` C${x1},${my} ${x2},${my} ${x2},${y2}`;
  }
  return d;
}

function StationCard({
  station,
  on,
  reduce,
}: {
  station: Station;
  on: boolean;
  reduce: boolean;
}) {
  const Icon = station.icon;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 18 });

  return (
    <motion.div
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.25, y: 16, scale: 0.96 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={
        "rounded-2xl border p-5 backdrop-blur-md transition-colors duration-500 " +
        (on
          ? "border-[#7C8CFF]/50 bg-white/[0.06] shadow-[0_0_40px_-8px_rgba(124,140,255,0.55)]"
          : "border-white/10 bg-white/[0.02]")
      }
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={
            "grid size-10 place-items-center rounded-xl transition-colors duration-500 " +
            (on ? "bg-[#5367D9] text-white" : "bg-white/10 text-white/60")
          }
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="text-xs tracking-wide text-[#A5B4FF]">{station.tag}</span>
      </div>
      <h3 className="text-lg font-bold text-white">{station.title}</h3>
      <p className="mt-2 text-sm leading-7 text-white/70">{station.text}</p>
    </motion.div>
  );
}

export function NeuralFlowSection() {
  const reduce = useReducedMotion() ?? false;
  const boxRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const thresholds = useRef<number[]>([1, 1, 1, 1]);

  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(0);

  const pts = mobile ? MOBILE_PTS : DESKTOP_PTS;
  const d = buildPath(pts);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // پیشرفت اسکرول همین بخش (۰..۱) با فنر برای حرکت نرم
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start 70%", "end 55%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  // موقعیت گره‌ی درخشان (درصد)
  const nodeX = useMotionValue(pts[0][0]);
  const nodeY = useMotionValue(0);
  const nodeLeft = useTransform(nodeX, (x) => `${x}%`);
  const nodeTop = useTransform(nodeY, (y) => `${y}%`);

  /** هر ایستگاه در چه پیشرفتی از مسیر قرار دارد */
  const measure = () => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    const th: number[] = [];
    let si = 0;
    const STEPS = 400;
    for (let s = 0; s <= STEPS && si < 4; s++) {
      const pt = path.getPointAtLength((L * s) / STEPS);
      if (pt.y >= pts[si + 1][1] - 0.01) {
        th.push(s / STEPS);
        si++;
      }
    }
    while (th.length < 4) th.push(1);
    thresholds.current = th;
  };

  const update = (v: number) => {
    const path = pathRef.current;
    if (!path) return;
    const p = Math.min(Math.max(v, 0), 1);
    const pt = path.getPointAtLength(path.getTotalLength() * p);
    nodeX.set(pt.x);
    nodeY.set(pt.y);
    let n = 0;
    for (const t of thresholds.current) if (p >= t - 0.005) n++;
    setActive((prev) => (prev === n ? prev : n));
  };

  useMotionValueEvent(smooth, "change", (v) => {
    if (!reduce) update(v);
  });

  // بعد از تغییر مسیر (موبایل ↔ دسکتاپ) دوباره اندازه بگیر
  useEffect(() => {
    if (reduce) {
      setActive(4);
      return;
    }
    measure();
    update(smooth.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile, reduce]);

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-[#5367D9]/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="container-site relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip-gradient inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white">
            جریان رشد
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-[1.4] text-white md:text-4xl">
            از داده‌ی خام تا <span className="gradient-text-light">رشد واقعی</span>
          </h2>
          <p className="mt-4 text-white/70">اسکرول کنید و مسیر را دنبال کنید.</p>
        </div>

        <div ref={boxRef} className="relative mx-auto mt-14 h-[1100px] max-w-6xl md:h-[1500px]">
          {/* مسیر */}
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {/* userSpaceOnUse لازم است: روی خط کاملاً عمودی (موبایل) bbox عرض صفر دارد */}
              <linearGradient id="nf-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="100">
                <stop offset="0%" stopColor="#8FA0FF" />
                <stop offset="55%" stopColor="#7C5DF0" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d={d}
              fill="none"
              stroke="url(#nf-grad)"
              strokeWidth={3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduce ? 1 : smooth }}
              className="drop-shadow-[0_0_8px_rgba(124,140,255,0.9)]"
            />
          </svg>

          {/* نقطه‌ی ایستگاه‌ها */}
          {STATIONS.map((_, i) => {
            const [sx, sy] = pts[i + 1];
            const on = i < active;
            return (
              <span
                key={`dot-${i}`}
                aria-hidden="true"
                style={{ left: `${sx}%`, top: `${sy}%` }}
                className={
                  "absolute z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500 " +
                  (on
                    ? "scale-125 border-white bg-[#7C8CFF] shadow-[0_0_20px_6px_rgba(124,140,255,0.8)]"
                    : "border-white/30 bg-ink")
                }
              />
            );
          })}

          {/* گره‌ی درخشان که با اسکرول حرکت می‌کند */}
          {!reduce && (
            <motion.span
              aria-hidden="true"
              style={{ left: nodeLeft, top: nodeTop }}
              className="absolute z-20 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_28px_10px_rgba(124,140,255,0.9)]"
            >
              <span className="absolute inset-0 rounded-full bg-white/60 motion-safe:animate-ping" />
            </motion.span>
          )}

          {/* کارت‌ها */}
          {STATIONS.map((st, i) => {
            const [sx, sy] = pts[i + 1];
            const placeRight = sx < 50; // نقطه سمت چپ → کارت سمت راستش
            const pos = mobile
              ? { top: `${sy}%`, left: 0, right: "12%" }
              : placeRight
                ? { top: `${sy}%`, left: "42%", width: "38%" }
                : { top: `${sy}%`, right: "42%", width: "38%" };
            return (
              <div key={st.title} style={pos} className="absolute z-10 -translate-y-1/2">
                <StationCard station={st} on={i < active} reduce={reduce} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
