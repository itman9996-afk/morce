import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { ConsultationForm } from "@/components/forms/consultation";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "تماس با ما و درخواست مشاوره",
  description:
    "برای رشد کسب‌وکارتان آماده‌اید؟ فرم درخواست مشاوره را پر کنید یا مستقیم تماس بگیرید.",
  alternates: { canonical: "/contact" },
};

const steps = [
  {
    title: "تماس سریع",
    desc: "بعد از ثبت فرم، برای هماهنگی زمان جلسه با شما تماس می‌گیریم.",
  },
  {
    title: "جلسه‌ی شناخت",
    desc: "در یک جلسه، وضعیت فعلی و اهداف کسب‌وکار شما را بررسی می‌کنیم.",
  },
  {
    title: "پیشنهاد اولیه",
    desc: "مسیر پیشنهادی برای سیستم رشد شما را شفاف ارائه می‌دهیم.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* هیرو تماس */}
      <section className="band-a border-b border-line py-14 md:py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="تماس با ما"
              title="برای رشد کسب‌وکارتان آماده‌اید؟"
              description="بیایید ببینیم کدام بخش از کسب‌وکار شما می‌تواند با بازاریابی، هوش مصنوعی و اتوماسیون بهتر عمل کند. فرم را پر کنید یا مستقیم تماس بگیرید."
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24" aria-label="درخواست مشاوره">
        <Container className="grid gap-10 lg:grid-cols-12">
          {/* کارت‌های تماس */}
          <div className="space-y-5 lg:col-span-5">
            <Reveal>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="card-glow flex items-start gap-4 rounded-2xl border border-line bg-white/85 p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-ink">تماس مستقیم</span>
                  <span dir="ltr" className="mt-1 block text-xl font-bold text-accent">
                    {siteConfig.contact.phoneDisplay}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.06}>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="card-glow flex items-start gap-4 rounded-2xl border border-line bg-white/85 p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">ایمیل</span>
                  <span dir="ltr" className="mt-1 block break-all text-[0.95rem] font-medium text-ink/80">
                    {siteConfig.contact.email}
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex items-start gap-4 rounded-2xl border border-line bg-white/85 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <MapPin className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold">آدرس</h2>
                  {/* آدرس دقیق را بعداً در lib/site-config.ts (contact.address) می‌گذاریم */}
                  <p className="mt-1 text-sm leading-7 text-muted">به‌زودی — جلسات آنلاین و حضوری</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="flex items-start gap-4 rounded-2xl border border-line bg-white/85 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Clock className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold">ساعات پاسخ‌گویی</h2>
                  <p className="mt-1 text-sm leading-7 text-muted">
                    شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر — فرم‌ها در هر ساعتی ثبت می‌شوند.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <ol className="space-y-4 rounded-2xl border border-line bg-white/85 p-6">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-sm font-bold text-white">
                      {["۱", "۲", "۳"][i]}
                    </span>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-muted">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* فرم */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <ConsultationForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}