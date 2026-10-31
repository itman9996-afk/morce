"use client";

/**
 * پلن‌های همکاری — اقتصادی / طلایی / الماس
 *  - بدون قیمت جعلی: تا وقتی price در آرایه پر نشده، جمله‌ی شفاف «پس از جلسه‌ی شناخت» نشان داده می‌شود
 *  - کارت طلایی برجسته با بج «پیشنهاد ما»
 *  - CTA هر پلن به فرم مشاوره با ?plan= می‌رود
 */
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionBackground } from "@/components/ui/section-background";
import { Check, Gem, Sparkles, Trophy, type LucideIcon } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { cn } from "@/lib/site-config";
import { TiltWrapper } from "@/components/ui/tilt-wrapper"; // ✅ ایمپورت اضافه شد

interface Plan {
  id: string;
  name: string;
  en: string;
  Icon: LucideIcon;
  price?: string;
  description: string;
  features: string[];
  featured?: boolean;
  cta: string;
}

const plans: Plan[] = [
  {
    id: "eco",
    name: "اقتصادی",
    en: "STARTER",
    Icon: Sparkles,
    description: "شروع هوشمند برای کسب‌وکارهایی که می‌خواهند قدم اول را محکم بردارند.",
    features: [
      "یک خدمت به انتخاب شما (محتوا یا تبلیغات)",
      "برنامه‌ریزی و اجرای ماهانه",
      "گزارش عملکرد ماهانه",
      "پشتیبانی در پیام‌رسان",
    ],
    cta: "شروع با پلن اقتصادی",
  },
  {
    id: "gold",
    name: "طلایی",
    en: "GROWTH",
    Icon: Trophy,
    description: "ترکیب محتوا و تبلیغات با هوشمندی — بیشترین بازدهی برای اکثر کسب‌وکارها.",
    featured: true,
    features: [
      "تولید محتوا + مدیریت تبلیغات",
      "چت‌بات پایه برای پاسخ‌گویی مشتریان",
      "بهینه‌سازی نرخ تبدیل",
      "گزارش دوهفته‌ای + جلسه‌ی ماهانه",
      "اولویت در پشتیبانی",
    ],
    cta: "شروع با پلن طلایی",
  },
  {
    id: "diamond",
    name: "الماس",
    en: "FULL SYSTEM",
    Icon: Gem,
    description: "سیستم کامل رشد: محتوا، هوش مصنوعی، اتوماسیون و بازاریابی — همه متصل به هم.",
    features: [
      "هر چهار خدمت به‌صورت یکپارچه",
      "اتوماسیون کامل فرایندها با n8n",
      "داشبورد اختصاصی شاخص‌ها",
      "جلسه‌ی هفتگی و بهینه‌سازی مستمر",
      "پاسخ‌گویی فوری و اختصاصی",
    ],
    cta: "شروع با پلن الماس",
  },
];

export function PlansSection() {
  return (
    <section id="plans" className="bg-ink scroll-mt-24 py-20 md:py-28" aria-labelledby="plans-title">
      <SectionBackground>
        <Container>
          <Reveal>
            <SectionHeading
              id="plans-title"
              align="center"
              eyebrow="پلن‌های همکاری"
              title="مسیر رشدت را انتخاب کن"
              description="سه سطح همکاری برای هر مرحله از کسب‌وکار — و هر پلن متناسب با شرایط شما قابل شخصی‌سازی است."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {plans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.08} className={cn(plan.featured && "lg:-mt-4 lg:mb-4")}>
                
                {/* ✅ کارت داخل TiltWrapper پیچیده شد تا با حرکت موس حالت سه‌بعدی بگیرد */}
                <TiltWrapper className="h-full">
                  <div
                    className={cn(
                      "card-glow relative flex h-full flex-col rounded-3xl border p-7 md:p-8 transition-all duration-300",
                      plan.featured
                        ? "border-transparent bg-gradient-to-b from-accent to-violet-500 text-white shadow-[0_28px_70px_-28px_rgba(83,103,217,0.75)]"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    {plan.featured ? (
                      <span className="absolute -top-3.5 start-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white shadow-lg rtl:translate-x-1/2">
                        پیشنهاد ما
                      </span>
                    ) : null}

                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-2xl",
                          plan.featured
                            ? "bg-white/20 text-white"
                            : "bg-gradient-to-br from-accent to-violet-500 text-white"
                        )}
                      >
                        <plan.Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span>
                        <span className={cn("block text-xl font-bold", plan.featured ? "text-white" : "text-white")}>
                          پلن {plan.name}
                        </span>
                        <span
                          className={cn(
                            "block text-[0.6rem] font-semibold uppercase tracking-[0.22em]",
                            plan.featured ? "text-white/70" : "text-accent"
                          )}
                        >
                          {plan.en}
                        </span>
                      </span>
                    </div>

                    <p className={cn("mt-4 text-sm leading-7", plan.featured ? "text-white/85" : "text-white/70")}>
                      {plan.description}
                    </p>

                    <div className={cn("mt-5 rounded-2xl border p-4 text-center", plan.featured ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5")}>
                      {plan.price ? (
                        <span className={cn("text-lg font-black", plan.featured ? "text-white" : "text-white")}>
                          {plan.price}
                        </span>
                      ) : (
                        <span className={cn("text-sm font-semibold", plan.featured ? "text-white/90" : "text-white")}>
                          قیمت پس از جلسه‌ی شناخت
                        </span>
                      )}
                      <span className={cn("mt-1 block text-[0.65rem] leading-5", plan.featured ? "text-white/70" : "text-white/60")}>
                        بر اساس دامنه‌ی کار و نیاز واقعی کسب‌وکار شما
                      </span>
                    </div>

                    <ul className={cn("mt-6 flex-1 space-y-3", plan.featured ? "text-white/90" : "text-white/80")}>
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm leading-7">
                          <span
                            className={cn(
                              "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full",
                              plan.featured ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                            )}
                          >
                            <Check className="size-3" aria-hidden="true" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`/contact?plan=${plan.id}`}
                      className={cn(
                        "mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all",
                        plan.featured
                          ? "bg-white text-accent shadow-lg hover:brightness-95"
                          : "btn-gradient text-white shadow-[0_8px_24px_-10px_rgba(83,103,217,0.65)] hover:shadow-[0_12px_32px_-10px_rgba(83,103,217,0.75)]"
                      )}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </TiltWrapper>

              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15}>
            <p className="mt-10 text-center text-sm leading-7 text-white/60">
              مطمئن نیستی کدام پلن برای توست؟{" "}
              <a href="/contact" className="font-semibold text-accent hover:underline">
                در یک جلسه‌ی رایگان مشخص می‌کنیم.
              </a>
            </p>
          </Reveal>
        </Container>
      </SectionBackground>
    </section>
  );
}