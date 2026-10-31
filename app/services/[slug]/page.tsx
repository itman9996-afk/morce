import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { AnalyzePromo } from "@/components/sections/analyze-promo";
import { serviceGroups } from "@/data/content";
import { servicePageConfig } from "@/data/service-pages";
import { getServiceImage, getSubserviceImage } from "@/data/media";
import { siteConfig } from "@/lib/site-config";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { SiteImage } from "@/components/ui/site-image";
import { ServiceVideoHero } from "@/components/sections/service-shared";
import { CtaSection } from "@/components/sections/proof-contact";
import {
  AIAgentFlowSection,
  AICrmSalesSection,
  AIOutcomeSection,
  AISystemSection,
} from "@/components/sections/ai-sections";
import {
  AIInContentSection,
  BeforeAfterSection,
  ContentEcosystemSection,
  ContentFactorySection,
} from "@/components/sections/content-sections";
import {
  AutomationBuilderSection,
  ManualVsAutomatedSection,
  N8nSection,
  OperationsSection,
} from "@/components/sections/automation-sections";
import {
  AnalyticsSection,
  FunnelSection,
  GrowthEngineSection,
  RetargetingSection,
} from "@/components/sections/marketing-sections";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return serviceGroups.map((group) => ({ slug: group.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = serviceGroups.find((g) => g.slug === slug);
  if (!group) return {};
  const config = servicePageConfig[slug];
  return {
    title: config?.metaTitle ?? group.title,
    description: config?.metaDescription ?? group.description,
    alternates: { canonical: `/services/${group.slug}` },
    openGraph: { title: config?.metaTitle ?? group.title, description: config?.metaDescription ?? group.description },
  };
}

function faNum(n: number) {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** سکشن‌های اختصاصی هر خدمت — معماری متفاوت برای هر صفحه */
const uniqueSections: Record<string, React.ReactNode> = {
  ai: (
    <>
      <AISystemSection />
      <AIAgentFlowSection />
      <AICrmSalesSection />
      <AIOutcomeSection />
    </>
  ),
  "ai-content": (
    <>
      <ContentEcosystemSection />
      <BeforeAfterSection />
      <AIInContentSection />
      <ContentFactorySection />
    </>
  ),
  automation: (
    <>
      <AutomationBuilderSection />
      <N8nSection />
      <OperationsSection />
      <ManualVsAutomatedSection />
    </>
  ),
    "digital-marketing": (
    <>
      <AnalyzePromo />
      <GrowthEngineSection />
      <FunnelSection />
      <AnalyticsSection />
      <RetargetingSection />
    </>
  ),
};

/** ترتیب زیرشاخه‌ها در هر صفحه متفاوت است (بعد از سکشن‌های اختصاصی) */
export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const group = serviceGroups.find((g) => g.slug === slug);
  if (!group) notFound();

  const config = servicePageConfig[slug];
  const heroImage = getServiceImage(slug);

  return (
    <>
      {/* ناوبری */}
      <nav aria-label="مسیر صفحه" className="border-b border-line bg-white/70 py-3 text-sm text-muted">
        <Container>
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-ink">خانه</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/services" className="hover:text-ink">خدمات</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink">{group.title}</li>
          </ol>
        </Container>
      </nav>

      {/* هیرو با ویدیوی اختصاصی */}
      <ServiceVideoHero
        label={config?.label ?? group.title}
        title={group.title}
        description={group.description}
        videoSrc={config?.videoSrc ?? ""}
        posterSrc={config?.posterSrc}
        videoTitle={config?.videoTitle ?? `ویدیوی معرفی ${group.title}`}
        flow={config?.flow ?? []}
        band={config?.band}
        contactHref={siteConfig.cta.contactHref}
        contactLabel="درخواست مشاوره"
        secondaryHref="/projects"
        secondaryLabel="مشاهده‌ی نمونه‌کارها"
      />

      {/* سکشن‌های اختصاصی هر خدمت */}
      {uniqueSections[slug]}

      {/* زیرشاخه‌ها — ساختار مشترک حفظ‌شده */}
      <section className="border-y border-line py-16 md:py-24" aria-labelledby="subservices-title">
        <Container>
          <Reveal>
            <SectionHeading
              id="subservices-title"
              eyebrow="زیرشاخه‌ها"
              title={`در ${group.title} دقیقاً چه کارهایی انجام می‌دهیم؟`}
            />
          </Reveal>

          <div className="mt-14 space-y-16 md:space-y-20">
            {group.items.map((item, i) => {
              const image = getSubserviceImage(slug, i);
              const flip = i % 2 === 1;
              return (
                <Reveal key={item.title} delay={0.04}>
                  <article id={`sub-${i}`} className="scroll-mt-28">
                    <div className="grid items-center gap-8 md:grid-cols-12">
                      <div className={flip ? "md:order-2 md:col-span-6" : "md:col-span-6"}>
                        <SiteImage
                          asset={image}
                          className="aspect-[16/10] w-full"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                      <div className="md:col-span-6">
                        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet-500 text-lg font-black text-white shadow-[0_8px_20px_-8px_rgba(83,103,217,0.7)]">
                          {faNum(i + 1).padStart(2, "۰")}
                        </span>
                        <h3 className="mt-4 text-2xl font-bold leading-[1.5]">{item.title}</h3>
                        <p className="mt-3 text-[0.95rem] leading-7 text-muted">{item.description}</p>
                        <div className="mt-5">
                          <Link
                            href={siteConfig.cta.contactHref}
                            className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
                          >
                            درخواست مشاوره برای {item.title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* مزایا — مشترک بین هر چهار صفحه (KEEP) */}
      <section className="band-a border-y border-line py-16 md:py-24" aria-labelledby="benefits-title">
        <Container>
          <Reveal>
            <h2 id="benefits-title" className="text-2xl font-bold md:text-3xl">چه چیزی نصیب شما می‌شود؟</h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {group.page.benefits.map((benefit, i) => (
              <Reveal key={benefit} delay={i * 0.05}>
                <li className="flex items-start gap-3 rounded-2xl border border-line bg-white/85 p-5 transition-colors hover:border-accent/40">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-[0.95rem] leading-7 text-ink/90">{benefit}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          {heroImage ? null : null}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}