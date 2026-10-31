"use client";

/**
 * VisitorTracker — کامپوننت نامرئی که در layout گذاشته می‌شود
 *  - در هر تغییر مسیر یک page_view به /api/track می‌فرستد
 *  - fetch با keepalive → حتی موقع بستن تب از دست نمی‌رود
 *  - هر خطایی بی‌صدا نادیده گرفته می‌شود — هیچ‌وقت UX را خراب نمی‌کند
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getVisitorId,
  getSessionId,
  getUtm,
} from "@/lib/visitor/client";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const payload = {
      event_id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`,
      type: "page_view" as const,
      path: pathname,
      referrer: typeof document !== "undefined" ? document.referrer.slice(0, 300) || undefined : undefined,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      utm: getUtm() ?? undefined,
      screen:
        typeof window !== "undefined"
          ? { w: window.screen.width, h: window.screen.height }
          : undefined,
      language: typeof navigator !== "undefined" ? navigator.language : undefined,
      timezone: (() => {
        try {
          return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
          return undefined;
        }
      })(),
    };

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* ردیابی هرگز نباید خطای قابل مشاهده بسازد */
    });
  }, [pathname]);

  return null;
}