"use client";

/**
 * هدر — دکمه‌های مشاوره قطعی به /contact (بدون وابستگی به contactHref)
 * منوی خدمات وسط ناوبری — بدون خروج از صفحه
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Clapperboard,
  Menu,
  Megaphone,
  Sparkles,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn, navItems, siteConfig, trackEvent } from "@/lib/site-config";
import { serviceGroups, type IconKey } from "@/data/content";
import { Button } from "@/components/ui/core";

const iconMap: Record<IconKey, LucideIcon> = {
  megaphone: Megaphone,
  clapperboard: Clapperboard,
  sparkles: Sparkles,
  workflow: Workflow,
};

function BrandMark() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={siteConfig.name}>
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-base font-bold text-white shadow-[0_6px_18px_-6px_rgba(83,103,217,0.7)] transition-transform duration-300 group-hover:scale-105">
        ع
        <span className="absolute -end-1 -top-1 size-2.5 rounded-full bg-emerald-400 ring-2 ring-surface" />
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        {siteConfig.name}
        <span className="gradient-text">.</span>
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hero = document.querySelector("[data-video-hero]");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const scheduleCloseMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const glass = scrolled || megaOpen || heroInView;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        glass
          ? "border-b border-line/80 bg-surface/80 shadow-[0_8px_30px_-18px_rgba(32,37,43,0.35)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <BrandMark />

        <nav className="relative hidden lg:block" aria-label="ناوبری اصلی">
          <ul className="flex items-center gap-1">
            {navItems.map((item) =>
              "hasMega" in item && item.hasMega ? (
                <li
                  key={item.label}
                  className="static"
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleCloseMega}
                >
                  <div className="flex items-center rounded-full transition-colors hover:bg-accent-soft/70">
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "rounded-full px-4 py-2 text-[0.95rem] text-ink/80 transition-colors hover:text-ink",
                        isActive(item.href) && "font-semibold text-accent"
                      )}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls="mega-menu-services"
                      aria-label={`باز کردن زیرمنوی ${item.label}`}
                      onClick={() => setMegaOpen((v) => !v)}
                      onFocus={openMega}
                      className="rounded-full px-1.5 py-2 text-ink/60 transition-colors hover:text-accent"
                    >
                      <ChevronDown
                        className={cn("size-4 transition-transform duration-200", megaOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {megaOpen ? (
                      <motion.div
                        id="mega-menu-services"
                        role="region"
                        aria-label="خدمات"
                        initial={{ opacity: 0, y: 8, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.99 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute inset-x-0 top-full mx-auto mt-2.5 w-[min(64rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_28px_70px_-24px_rgba(32,37,43,0.35)]"
                      >
                        <div className="grid gap-6 p-6 sm:grid-cols-2 xl:grid-cols-4">
                          {serviceGroups.map((group) => {
                            const Icon = iconMap[group.icon];
                            return (
                              <div key={group.id}>
                                <Link
                                  href={`/services/${group.slug}`}
                                  className="group flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-accent-soft/60"
                                  onClick={() => setMegaOpen(false)}
                                >
                                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet-500 text-white shadow-[0_6px_14px_-6px_rgba(83,103,217,0.6)]">
                                    <Icon className="size-[1.1rem]" aria-hidden="true" />
                                  </span>
                                  <span>
                                    <span className="block text-[0.95rem] font-semibold text-ink group-hover:text-accent">
                                      {group.title}
                                    </span>
                                    <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted">
                                      {group.en}
                                    </span>
                                  </span>
                                </Link>
                                <ul className="mt-2 space-y-1 px-2">
                                  {group.items.map((sub) => (
                                    <li key={sub.title}>
                                      <Link
                                        href={`/services/${group.slug}`}
                                        onClick={() => setMegaOpen(false)}
                                        className="block rounded-md px-2 py-1 text-sm text-muted transition-colors hover:text-accent"
                                      >
                                        {sub.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-accent-soft/50 px-6 py-4">
                          <p className="text-sm text-ink/80">
                            نمی‌دانید کدام خدمت برای کسب‌وکار شما مناسب است؟
                          </p>
                          <Link
                            href="/contact"
                            onClick={() => {
                              setMegaOpen(false);
                              trackEvent("cta_click", { location: "mega_menu" });
                            }}
                            className="text-sm font-semibold text-accent hover:underline"
                          >
                            درخواست مشاوره
                          </Link>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-[0.95rem] transition-all duration-200 hover:bg-accent-soft/70 hover:text-ink",
                      isActive(item.href)
                        ? "bg-accent-soft font-semibold text-accent"
                        : "text-ink/80"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href="/contact"
            size="sm"
            className="hidden md:inline-flex"
            onClickCapture={() => trackEvent("cta_click", { location: "header" })}
          >
            {siteConfig.cta.header}
          </Button>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-line bg-surface/80 text-ink backdrop-blur lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="h-[3px] w-full bg-gradient-to-l from-accent via-violet-500 to-fuchsia-400 opacity-90"
      />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="منوی موبایل"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-[60] flex h-[100dvh] flex-col bg-background lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <BrandMark />
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full border border-line bg-surface"
                aria-label="بستن منو"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="ناوبری موبایل">
              <ul>
                {navItems.map((item) =>
                  "hasMega" in item && item.hasMega ? (
                    <li key={item.label} className="border-b border-line">
                      <button
                        type="button"
                        aria-expanded={mobileServicesOpen}
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className="flex w-full items-center justify-between py-4 text-left text-lg font-medium"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn("size-5 transition-transform", mobileServicesOpen && "rotate-180")}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileServicesOpen ? (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <li className="pb-3">
                              <Link
                                href="/services"
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl bg-accent-soft px-4 py-3 text-[0.95rem] font-semibold text-accent"
                              >
                                همه‌ی خدمات
                              </Link>
                            </li>
                            {serviceGroups.map((group) => (
                              <li key={group.id} className="pb-3">
                                <Link
                                  href={`/services/${group.slug}`}
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-xl bg-surface px-4 py-3 text-[0.95rem] font-semibold text-ink"
                                >
                                  {group.title}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        ) : null}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={item.label} className="border-b border-line">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-4 text-lg font-medium"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className="border-t border-line bg-surface p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <Button
                href="/contact"
                className="w-full"
                size="lg"
                onClickCapture={() => {
                  setMobileOpen(false);
                  trackEvent("cta_click", { location: "mobile_menu" });
                }}
              >
                {siteConfig.cta.header}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}