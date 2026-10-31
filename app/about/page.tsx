import type { Metadata } from "next";
import { ArrowLeft, Clapperboard, Cog, LineChart, MessagesSquare } from "lucide-react";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui/core";
import { SiteImage } from "@/components/ui/site-image";
import { siteImages } from "@/data/media";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "ما سیستم رشد می‌سازیم: تولید محتوای تبلیغاتی، هوش مصنوعی، اتوماسیون فرایندها و دیجیتال مارکتینگ — متناسب با نیاز واقعی هر کسب‌وکار.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "درباره ما",
    description: "تولید محتوا، هوش مصنوعی، اتوماسیون و دیجیتال مارکتینگ — یک سیستم، یک مسیر رشد.",
  },
};

const specialties = [
  {
    Icon: Clapperboard,
    title: "تولید محتوای تبلیغاتی",
    desc: "تیزر، ریلز، عکس محصول و محتوای UGC — با کیفیت استودیویی و ریتم انتشار منظم.",
  },
  {
    Icon: MessagesSquare,
    title: "خدمات هوش مصنوعی",
    desc: "چت‌بات آموزش‌دیده با محتوای کسب‌وکار شما، پشتیبانی و فروش هوشمند ۲۴ ساعته.",
  },
  {
    Icon: Cog,
    title: "اتوماسیون فرایندها",
    desc: "خودکارسازی ثبت لید، پیگیری مشتری و اتصال ابزارها — با مالکیت کامل داده توسط شما.",
  },
  {
    Icon: LineChart,
    title: "دیجیتال مارکتینگ",
    desc: "تبلیغات هدفمند، بهینه‌سازی نرخ تبدیل و تحلیل مستمر — تصمیم بر اساس داده، نه حدس.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* هیروی متنی */}
      <section className="band-a border-b border-line py-16 md:py-24" aria-labelledby="about-hero-title">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="chip-gradient inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white">
                  درباره‌ی ما
                </span>
                <h1 id="about-hero-title" className="mt-4 text-3xl font-bold leading-[1.4] md:text-5xl md:leading-[1.3]">
                  ما «سیستم رشد» می‌سازیم،{" "}
                  <span className="gradient-text">نه فقط خدمات پراکنده</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-9 text-muted md:text-lg">
                  اکثر کسب‌وکارها محتوا تولید می‌کنند، تبلیغ می‌دهند و با مشتری‌هایشان در ارتباط‌اند — اما این‌ها به هم وصل نیستند؛ هر قطعه جدا کار می‌کند و نتیجه‌ی واقعی دیده نمی‌شود. کار ما این است که همین قطعه‌ها را به یک سیستم منسجم تبدیل کنیم: محتوایی که مشتری را می‌آورد، سیستمی که پیام‌ها را جواب می‌دهد و فرایندهایی که خودشان کار می‌کنند.
                </p>
                <p className="mt-4 max-w-2xl text-base leading-9 text-muted">
                  به‌جای بسته‌ی آماده‌ی تکراری، برای هر کسب‌وکار وضعیت موجود را می‌سنجیم، مسیر پیشنهادی را شفاف می‌گوییم و مرحله‌به‌مرحله اجرا می‌کنیم — از تیزر تبلیغاتی و ریلز تا چت‌بات، اتوماسیون n8n و قیف فروش.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="/contact">
                    درخواست مشاوره
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </Button>
                  <Button href="/projects" variant="outline">
                    مشاهده‌ی نمونه‌کارها
                  </Button>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.08} className="lg:col-span-5">
              <SiteImage asset={siteImages.about} className="w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
              <p className="mt-2 text-center text-[0.65rem] text-muted">
                قاب بالا با پرتره‌ی واقعی برند جایگزین می‌شود.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* تخصص‌ها */}
      <section className="py-16 md:py-24" aria-labelledby="about-spec-title">
        <Container>
          <Reveal>
            <SectionHeading
              id="about-spec-title"
              align="center"
              eyebrow="چه کارهایی انجام می‌دهیم"
              title="چهار تخصص، یک هدف: رشد قابل اندازه‌گیری"
            />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {specialties.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="card-glow flex h-full items-start gap-4 rounded-2xl border border-line bg-white/90 p-6">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet-500 text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{title}</span>
                    <span className="mt-1.5 block text-sm leading-7 text-muted">{desc}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20" aria-label="تماس">
        <Container>
          <div className="cta-band rounded-3xl p-8 text-center md:p-10">
            <h2 className="text-xl font-bold md:text-2xl">
              بگذار وضعیت کسب‌وکارت را ببینیم
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink/70">
              در یک جلسه‌ی کوتاه، وضعیت فعلی و مسیر پیشنهادی را شفاف می‌گوییم — بدون تعهد.
            </p>
            <Button href={siteConfig.cta.contactHref} size="lg" className="mt-6">
              درخواست جلسه‌ی مشاوره
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}