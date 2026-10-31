/**
 * پیکربندی اختصاصی هر صفحه‌ی خدمت — ویدیو، Poster، جریان و متادیتا
 * ویدیوها در public/videos و Posterها کنارشان قرار می‌گیرند.
 * تا وقتی ویدیو نباشد، پنل جای‌گیر شیک نمایش داده می‌شود.
 */

export interface ServicePageConfig {
  label: string;
  videoTitle: string;
  videoSrc: string;
  posterSrc: string;
  /** جریان کار زیر ویدیو */
  flow: string[];
  band: "band-a" | "band-b" | "band-c";
  metaTitle: string;
  metaDescription: string;
}

export const servicePageConfig: Record<string, ServicePageConfig> = {
  ai: {
    label: "هوش مصنوعی کسب‌وکار",
    videoTitle: "ویدیوی معرفی هوش مصنوعی کسب‌وکار",
    videoSrc: "/videos/ai-business-intelligence.mp4",
    posterSrc: "/videos/ai-business-intelligence-poster.jpg",
    flow: ["داده‌ی کسب‌وکار", "تحلیل AI", "تصمیم هوشمند", "اقدام", "نتیجه"],
    band: "band-b",
    metaTitle: "هوش مصنوعی برای کسب‌وکار — چت‌بات، ایجنت و فروش هوشمند",
    metaDescription:
      "چت‌بات آموزش‌دیده با محتوای کسب‌وکار شما، ایجنت‌های هوشمند، پشتیبانی و فروش خودکار — هوش مصنوعی که داده را به تصمیم و اقدام تبدیل می‌کند.",
  },
  "ai-content": {
    label: "تولید محتوا با هوش مصنوعی",
    videoTitle: "ویدیوی معرفی تولید محتوا",
    videoSrc: "/videos/ai-content-production.mp4",
    posterSrc: "/videos/ai-content-production-poster.jpg",
    flow: ["ایده", "سناریو", "تولید", "تدوین", "انتشار"],
    band: "band-c",
    metaTitle: "تولید محتوا با هوش مصنوعی — ریلز، ویدیو، عکس و UGC",
    metaDescription:
      "استودیوی محتوای هوشمند: ریلز، ویدیوی تبلیغاتی، عکس محصول و محتوای UGC — چند برابر سریع‌تر از روش سنتی و هماهنگ با هویت برند شما.",
  },
  automation: {
    label: "اتوماسیون کسب‌وکار",
    videoTitle: "ویدیوی معرفی اتوماسیون",
    videoSrc: "/videos/business-automation-workflow.mp4",
    posterSrc: "/videos/business-automation-workflow-poster.jpg",
    flow: ["پیام مشتری", "تشخیص AI", "ثبت در CRM", "اطلاع به فروش", "پیگیری"],
    band: "band-a",
    metaTitle: "اتوماسیون کسب‌وکار با n8n — Workflow، اتصال سیستم‌ها و لید",
    metaDescription:
      "خودکارسازی فرایندها با n8n و هوش مصنوعی: ثبت لید، پیگیری مشتری، اتصال ابزارها و حذف کارهای تکراری — سیستم مقیاس‌پذیر با مالکیت کامل داده.",
  },
  "digital-marketing": {
    label: "دیجیتال مارکتینگ و رشد",
    videoTitle: "ویدیوی معرفی سیستم رشد",
    videoSrc: "/videos/digital-growth-system.mp4",
    posterSrc: "/videos/digital-growth-system-poster.jpg",
    flow: ["تبلیغ", "لندینگ", "لید", "CRM", "ریتارگتینگ", "تبدیل"],
    band: "band-b",
    metaTitle: "دیجیتال مارکتینگ و رشد — قیف فروش، تحلیل و ریتارگتینگ",
    metaDescription:
      "سیستم رشد داده‌محور: جذب با تبلیغات هدفمند، بهینه‌سازی نرخ تبدیل، تحلیل مستمر و ریتارگتینگ — از بازدید تا فروش و وفاداری.",
  },
};