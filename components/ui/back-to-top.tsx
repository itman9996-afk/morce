"use client";

/** دکمه‌ی بازگشت به بالا — بعد از ۶۰۰ پیکسل اسکرول ظاهر می‌شود */
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="بازگشت به بالای صفحه"
      className="fixed bottom-24 end-5 z-40 flex size-11 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-[0_12px_32px_-12px_rgba(32,37,43,0.4)] backdrop-blur transition-all hover:scale-105 hover:border-accent hover:text-accent"
    >
      <ChevronUp className="size-5" aria-hidden="true" />
    </button>
  );
}