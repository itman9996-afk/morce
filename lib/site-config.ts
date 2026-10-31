/**
 * تنظیمات مرکزی کسب‌وکار
 * برای تغییر نام برند، اطلاعات تماس و لینک‌ها فقط همین فایل را ویرایش کنید.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toFaDigits(value: number | string) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export const siteConfig = {
  /** نام برند — موقتاً «عباس» است؛ برای تغییر فقط همین را عوض کنید */
  name: "عباس",
  nameEn: "ABBAS",
  tagline: "سیستم رشد هوشمند کسب‌وکار",
  description:
    "از بازاریابی و تولید محتوا تا هوش مصنوعی و اتوماسیون؛ راهکارهایی می‌سازیم که به کسب‌وکار شما کمک می‌کنند بهتر دیده شود، بیشتر بفروشد و هوشمندتر رشد کند.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    phone: "",
    email: "",
    address: "",
  },

  social: {
    instagram: "",
    linkedin: "",
    telegram: "",
  },

  cta: {
    header: "درخواست مشاوره",
    heroPrimary: "شروع مشاوره",
    heroSecondary: "مشاهده خدمات",
    contactHref: "/#contact",
  },
} as const;

export const navItems = [
  { label: "خانه", href: "/" },
  { label: "خدمات", href: "/#services", hasMega: true },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
] as const;

/** نقطه‌ی یکپارچه‌سازی تحلیلی (GA4 / dataLayer / سرویس دلخواه) */
export function trackEvent(name: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: name, ...payload });
  if (typeof w.gtag === "function") w.gtag("event", name, payload ?? {});
}

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;