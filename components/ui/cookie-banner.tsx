"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-accepted");
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-accepted", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-white/10 bg-ink/95 p-4 backdrop-blur-md md:bottom-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-white/80">
            ما از کوکی‌ها برای بهبود تجربه شما استفاده می‌کنیم. با ادامه استفاده از سایت، شما با{" "}
            <a href="/privacy" className="text-accent hover:underline">سیاست حریم خصوصی</a> ما موافقت می‌کنید.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={accept} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent/80">
            قبول می‌کنم
          </button>
          <button onClick={() => setShow(false)} className="rounded-lg border border-white/10 p-2 text-white/60 transition-colors hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}