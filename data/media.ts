/**
 * رجیستری رسانه‌ها — نمونه‌کارها با فایل‌های واقعی روی دیسک:
 *   showcase-1.mp4 + showcase-1-poster.jpg  → تیزر برند «شیقلم» (آرایشی/بهداشتی)
 *   showcase-2.mp4 + showcase-2-poster.jpg  → تیزر کافه
 *   showcase-3.mp4 + showcase-3-poster.jpg  → تیزر مبلمان
 * اگر ترتیب واقعی فایل‌ها متفاوت است، فقط videoSrc/posterSrc را بین بلوک‌ها جابه‌جا کن.
 */

export interface SiteImageAsset {
  src: string;
  alt: string;
}

export const siteImages = {
  coreSystem: { src: "/images/core-system.jpg", alt: "پنل دیجیتال و سیستم هوشمند کسب‌وکار" },
  industries: { src: "/images/industries.jpg", alt: "کسب‌وکارهای متنوع در حال رشد" },
  process: { src: "/images/process-strategy.jpg", alt: "جلسه‌ی استراتژی و برنامه‌ریزی رشد کسب‌وکار" },
  flow: { src: "/images/flow-system.jpg", alt: "سیستم دیجیتال و اتوماسیون در کسب‌وکار" },
  "service-digital-marketing": { src: "/images/service-marketing.jpg", alt: "کمپین تبلیغات دیجیتال و تحلیل داده" },
  "service-ai-content": { src: "/images/service-content.jpg", alt: "استودیوی تولید محتوای ویدیویی" },
  "service-ai": { src: "/images/service-ai.jpg", alt: "هوش مصنوعی و چت‌بات برای کسب‌وکار" },
  "service-automation": { src: "/images/service-automation.jpg", alt: "اتوماسیون و اتصال ابزارهای دیجیتال" },
  about: {
    src: "/brand/about-placeholder.svg",
    alt: "تصویر برند — جایگزینی با پرتره‌ی واقعی در انتظار است",
  },
} satisfies Record<string, SiteImageAsset>;

export function getServiceImage(slug: string): SiteImageAsset | undefined {
  const map = siteImages as Record<string, SiteImageAsset>;
  return map[`service-${slug}`];
}

/* --------------------- عکس زیرشاخه‌ها --------------------- */
const subserviceImages: Record<string, SiteImageAsset> = {};

export function getSubserviceImage(slug: string, index: number): SiteImageAsset | undefined {
  return subserviceImages[`${slug}-${index}`] ?? getServiceImage(slug);
}

/* ------------------------------ نمونه‌کارها ------------------------------ */

export interface ShowcaseVideo {
  id: string;
  tag: string;
  title: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
}

export const showcaseVideos: ShowcaseVideo[] = [
  {
    id: "showcase-1",
    tag: "برند آرایشی و بهداشتی",
    title: "تیزر تبلیغاتی برند «شیقلم»",
    description:
      "تیزر تبلیغاتی برای معرفی محصولات برند آرایشی و بهداشتی شیقلم — تولید‌شده با ترکیب تصویربرداری و تقویت هوش مصنوعی.",
    videoSrc: "/videos/showcase-1.mp4",
    posterSrc: "/videos/showcase-1-poster.jpg",
  },
  {
    id: "showcase-2",
    tag: "کافه و رستوران",
    title: "تیزر تبلیغاتی کافه",
    description:
      "تیزر کوتاه تبلیغاتی برای معرفی فضای و منوی کافه — مناسب انتشار در ریلز و استوری اینستاگرام.",
    videoSrc: "/videos/showcase-2.mp4",
    posterSrc: "/videos/showcase-2-poster.jpg",
  },
  {
    id: "showcase-3",
    tag: "مبلمان و دکوراسیون",
    title: "تیزر تبلیغاتی مبلمان",
    description:
      "تیزر تبلیغاتی برای معرفی محصولات مبلمان — نمایش محصول با ریتم تصویری مناسب بازار فروش.",
    videoSrc: "/videos/showcase-3.mp4",
    posterSrc: "/videos/showcase-3-poster.jpg",
  },
];