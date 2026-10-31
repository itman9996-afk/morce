"use client";

import Link from "next/link";
import { Instagram, Linkedin, Mail, Phone, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/core";

// ✅ این دو خط ایمپورت بسیار مهم هستند. دقیقاً به همین شکل باشند:
import { navItems, siteConfig, toFaDigits } from "@/lib/site-config";
import { serviceGroups } from "@/data/content";

export default function Footer() {
  const year = toFaDigits(new Date().getFullYear());
  
  const socials = [
    { key: "instagram", label: "اینستاگرام", href: siteConfig.social.instagram, Icon: Instagram },
    { key: "linkedin", label: "لینکدین", href: siteConfig.social.linkedin, Icon: Linkedin },
    { key: "telegram", label: "تلگرام", href: siteConfig.social.telegram, Icon: Send },
  ].filter((s) => s.href);

  return (
    <footer className="relative bg-ink text-white pt-20 pb-10 border-t border-white/10">
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-accent via-violet-500 to-fuchsia-400" />

      <div className="container-site px-4">
        <div className="relative z-10 -mt-24 mb-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-md md:flex-row md:p-10">
          <div className="text-center md:text-start">
            <h2 className="text-xl font-bold md:text-2xl">
              آماده‌اید کسب‌وکارتان را <span className="text-accent">هوشمندتر</span> رشد دهید؟
            </h2>
            <p className="mt-2 text-sm leading-7 text-white/70">
              یک جلسه‌ی شناخت کافی است تا مسیر پیشنهادی سیستم رشد شما را ببینید.
            </p>
          </div>
          <Button href={siteConfig.cta.contactHref} size="lg" className="shrink-0">
            درخواست مشاوره رایگان
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-12 pb-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-lg font-bold text-white">
                ع
              </span>
              <span className="text-xl font-extrabold">
                {siteConfig.name}
                <span className="text-accent">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ key, label, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:border-accent hover:bg-accent hover:text-white"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-bold text-white">دسترسی سریع</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-white">خدمات ما</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {serviceGroups.map((group) => (
                <li key={group.id}>
                  <Link href={`/services/${group.slug}`} className="transition-colors hover:text-accent">
                    {group.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-white">ارتباط با ما</h3>
            <ul className="mt-5 space-y-4 text-sm text-white/60">
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} dir="ltr" className="flex items-center gap-3 transition-colors hover:text-white">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-accent">
                    <Phone className="size-4" />
                  </span>
                  <span className="font-semibold text-white/90">{siteConfig.contact.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} dir="ltr" className="flex items-center gap-3 break-all transition-colors hover:text-white">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-accent">
                    <Mail className="size-4" />
                  </span>
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 md:flex-row">
            <p>© {year} {siteConfig.name} — تمام حقوق مادی و معنوی محفوظ است.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">حریم خصوصی</Link>
              <Link href="/terms" className="hover:text-white transition-colors">قوانین و مقررات</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}