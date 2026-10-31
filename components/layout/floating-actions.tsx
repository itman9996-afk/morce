"use client";

/**
 * دکمه‌های شناور: تماس سریع (فقط موبایل) + بازگشت به بالا
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Phone } from "lucide-react";
import { siteConfig, trackEvent } from "@/lib/site-config";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex flex-col items-center gap-2.5">
      {/* بازگشت به بالا */}
      <AnimatePresence>
        {showTop ? (
          <motion.button
            key="to-top"
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={toTop}
            aria-label="بازگشت به بالای صفحه"
            className="pointer-events-auto flex size-11 items-center justify-center rounded-full border border-line bg-surface/90 text-ink shadow-lg backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* تماس سریع — فقط موبایل و تبلت */}
      <a
        href={`tel:${siteConfig.contact.phone}`}
        aria-label={`تماس با ${siteConfig.name}`}
        onClickCapture={() => trackEvent("cta_click", { location: "floating_call" })}
        className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_-8px_rgba(83,103,217,0.6)] transition-transform active:scale-95 md:hidden"
      >
        <Phone className="size-6" aria-hidden="true" />
        <span className="absolute size-14 animate-ping rounded-full bg-accent/40" aria-hidden="true" />
      </a>
    </div>
  );
}