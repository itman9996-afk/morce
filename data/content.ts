import { z } from "zod";

export type IconKey =
  | "megaphone"
  | "clapperboard"
  | "sparkles"
  | "workflow"
  | "users"
  | "file-video"
  | "target"
  | "user-plus"
  | "phone-call"
  | "shopping-bag"
  | "bar-chart"
  | "trending-up"
  | "shopping-cart"
  | "stethoscope"
  | "heart-pulse"
  | "utensils"
  | "building"
  | "user"
  | "key"
  | "graduation"
  | "factory"
  | "grid";

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ServicePageContent {
  problem: string;
  solution: string;
  benefits: string[];
}

export interface ServiceGroup {
  id: string;
  slug: string;
  title: string;
  en: string;
  description: string;
  icon: IconKey;
  items: ServiceItem[];
  page: ServicePageContent;
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    title: "دیجیتال مارکتینگ",
    en: "DIGITAL MARKETING",
    description:
      "استراتژی و اجرای فعالیت‌های بازاریابی برای جذب، تبدیل و بازگرداندن مشتری.",
    icon: "megaphone",
    items: [
      { title: "تبلیغات", description: "طراحی و مدیریت کمپین‌های هدفمند در پلتفرم‌های تبلیغاتی." },
      { title: "تحلیل", description: "اندازه‌گیری دقیق داده‌ها برای تصمیم‌های بهتر و ارزان‌تر." },
      { title: "افزایش فروش", description: "ساده و مؤثر کردن مسیر خرید برای مشتری." },
      { title: "بهینه‌سازی نرخ تبدیل", description: "بهبود قیف فروش بر اساس داده و آزمایش مستمر." },
      { title: "ریتارگتینگ", description: "بازگرداندن مخاطبانی که هنوز خرید نکرده‌اند." },
    ],
    page: {
      problem:
        "خیلی از کسب‌وکارها بودجه‌ی قابل‌توجهی در تبلیغات خرج می‌کنند؛ اما وقتی کمپین‌ها بدون تحلیل و بهینه‌سازی مداوم اجرا می‌شوند، بخش بزرگی از این بودجه هدر می‌رود و نتیجه‌ای که برمی‌گردد تصادفی و غیرقابل‌تکرار است.",
      solution:
        "ما فعالیت بازاریابی را مثل یک سیستم طراحی می‌کنیم: هدف‌گذاری دقیق، اجرای کمپین، اندازه‌گیری داده‌ها و بهینه‌سازی مستمر. نتیجه این می‌شود که هر تومان هزینه‌ی تبلیغات قابل ردیابی و قابل بهبود است.",
      benefits: [
        "کاهش هزینه‌ی جذب مشتری بر اساس داده‌های واقعی",
        "شناخت دقیق‌تر مخاطب و مسیر خرید",
        "کمپین‌های قابل اندازه‌گیری و قابل بهبود",
        "بازگرداندن مشتریان بالقوه با ریتارگتینگ",
      ],
    },
  },
  {
    id: "ai-content",
    slug: "ai-content",
    title: "تولید محتوا با هوش مصنوعی",
    en: "AI CONTENT",
    description:
      "تولید محتوای سریع‌تر، خلاقانه‌تر و هدفمند با ترکیب خلاقیت انسانی و هوش مصنوعی.",
    icon: "clapperboard",
    items: [
      { title: "تولید ویدیو", description: "ویدیوهای تبلیغاتی و معرفی با روند تولید سریع." },
      { title: "ریلز", description: "ریلزهای هدفمند برای دیده‌شدن در شبکه‌های اجتماعی." },
      { title: "عکس", description: "تولید و ادیت تصاویر باکیفیت متناسب با هویت برند." },
      { title: "محتوای تبلیغاتی", description: "کپی‌رایتینگ و پیام‌های تبلیغاتی که تبدیل می‌سازند." },
      { title: "UGC", description: "محتوای کاربرمحور برای اعتمادسازی و نرخ تبدیل بهتر." },
      { title: "ایده‌پردازی و سناریو", description: "طراحی ایده و سناریو قبل از تولید، برای محتوای هدفمند." },
    ],
    page: {
      problem:
        "تولید محتوای منظم و باکیفیت زمان‌بر و پرهزینه است. اکثر کسب‌وکارها یا محتوای کم و نامنظم تولید می‌کنند، یا کیفیت را فدای کمیت می‌کنند — و در هر دو حالت، فرصت دیده‌شدن از دست می‌رود.",
      solution:
        "با ترکیب خلاقیت انسانی و سرعت هوش مصنوعی یک خط تولید محتوا می‌سازیم: ایده، سناریو، تولید و انتشار؛ به‌صورت منظم و همسو با هویت و لحن برند شما.",
      benefits: [
        "سرعت تولید چند برابر، بدون افت کیفیت",
        "حجم مناسب محتوا برای پلتفرم‌های مختلف",
        "هماهنگی کامل با هویت و لحن برند",
        "کاهش هزینه‌ی تولید نسبت به روش‌های سنتی",
      ],
    },
  },
  {
    id: "ai",
    slug: "ai",
    title: "هوش مصنوعی",
    en: "ARTIFICIAL INTELLIGENCE",
    description:
      "طراحی راهکارهای هوشمند برای کاهش کارهای تکراری و بهبود تجربه مشتری.",
    icon: "sparkles",
    items: [
      { title: "چت‌بات", description: "پاسخ‌گویی خودکار و دقیق به مشتریان در تمام ساعات." },
      { title: "پشتیبانی هوشمند", description: "کاهش بار تیم پشتیبانی با پاسخ‌های هوشمند و دسته‌بندی خودکار." },
      { title: "فروش هوشمند", description: "پیگیری و راهنمایی لیدها در مسیر خرید." },
      { title: "سیستم‌های AI برای کسب‌وکار", description: "طراحی سیستم‌های هوشمند متناسب با فرایندهای شما." },
    ],
    page: {
      problem:
        "تیم شما هر روز ساعت‌ها وقت صرف پاسخ به سوالات تکراری، پیگیری لیدها و کارهای قابل‌پیش‌بینی می‌کند؛ نتیجه‌اش هزینه‌ی بالا، پاسخ‌گویی کند و از دست رفتن فرصت‌هاست.",
      solution:
        "راهکارهای هوش مصنوعی را برای کسب‌وکار شما طراحی و پیاده‌سازی می‌کنیم؛ از چت‌بات پاسخ‌گوی سریع تا سیستم‌های فروش و پشتیبانی هوشمندی که در کنار تیم شما کار می‌کنند.",
      benefits: [
        "پاسخ‌گویی سریع و ۲۴ ساعته به مشتریان",
        "کاهش بار کارهای تکراری روی تیم",
        "پیگیری منظم و بدون فراموشی لیدها",
        "تجربه‌ای بهتر و منسجم برای مشتری",
      ],
    },
  },
  {
    id: "automation",
    slug: "automation",
    title: "اتوماسیون",
    en: "AUTOMATION",
    description:
      "اتصال ابزارها و خودکارسازی فرایندها برای صرفه‌جویی در زمان و کاهش خطای انسانی.",
    icon: "workflow",
    items: [
      { title: "اتوماسیون فرایندهای کسب‌وکار", description: "خودکارسازی فرایندهای تکراری از ابتدا تا انتها." },
      { title: "اتصال ابزارها", description: "یکپارچه‌سازی ابزارهای فعلی شما برای جریان بدون وقفه‌ی داده." },
      { title: "n8n", description: "ساخت گردش‌کارهای انعطاف‌پذیر و مقیاس‌پذیر با n8n." },
      { title: "خودکارسازی لیدها", description: "ثبت، دسته‌بندی و توزیع خودکار لیدها بین تیم فروش." },
      { title: "پیگیری مشتری", description: "پیگیری منظم مشتریان بدون فراموشی و بدون دخالت دستی." },
      { title: "اتوماسیون فروش و پشتیبانی", description: "خودکارسازی چرخه‌ی فروش و پشتیبانی برای سرعت و دقت بیشتر." },
    ],
    page: {
      problem:
        "اطلاعات بین ابزارهای مختلف گم می‌شود، فرایندها دستی و کند انجام می‌شوند و هر جابه‌جایی دستی، احتمال خطای انسانی را بالاتر می‌برد.",
      solution:
        "ابزارهای شما را به هم متصل می‌کنیم و فرایندهای تکراری را خودکار می‌کنیم؛ از ثبت لید تا پیگیری مشتری و گزارش‌گیری، همه‌چیز سیستمی و بدون دخالت دستی پیش می‌رود.",
      benefits: [
        "صرفه‌جویی جدی در زمان تیم",
        "کاهش خطای انسانی در فرایندها",
        "هیچ لیدی گم نمی‌شود",
        "مقیاس‌پذیری عملیات بدون افزایش نیرو",
      ],
    },
  },
];

export const problemPoints = [
  "تولید محتوای ضعیف و نامنظم",
  "فرایندهای دستی و زمان‌بر",
  "پیگیری ناقص مشتری",
  "تبلیغات بدون تحلیل",
  "داده‌های بلااستفاده",
  "پاسخ‌گویی کند",
  "از دست رفتن لیدها",
  "نبود سیستم یکپارچه‌ی رشد",
] as const;

export interface Industry {
  label: string;
  icon: IconKey;
}

export const industries: Industry[] = [
  { label: "فروشگاه‌های اینترنتی", icon: "shopping-cart" },
  { label: "کلینیک‌ها", icon: "stethoscope" },
  { label: "پزشکان", icon: "heart-pulse" },
  { label: "رستوران‌ها", icon: "utensils" },
  { label: "شرکت‌ها", icon: "building" },
  { label: "برندهای شخصی", icon: "user" },
  { label: "املاک", icon: "key" },
  { label: "آموزشگاه‌ها", icon: "graduation" },
  { label: "تولیدکنندگان", icon: "factory" },
  { label: "سایر کسب‌وکارها", icon: "grid" },
];

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  { number: "۰۱", title: "شناخت", description: "بررسی وضعیت فعلی کسب‌وکار و پیدا کردن نقاط ضعف و فرصت‌ها." },
  { number: "۰۲", title: "استراتژی", description: "طراحی مسیر مناسب بر اساس اهداف و نیازهای کسب‌وکار." },
  { number: "۰۳", title: "اجرا", description: "اجرای محتوا، بازاریابی، AI و اتوماسیون." },
  { number: "۰۴", title: "بهینه‌سازی", description: "تحلیل داده‌ها و بهبود مداوم عملکرد." },
  { number: "۰۵", title: "رشد", description: "تمرکز روی افزایش فروش، کاهش هزینه و افزایش بهره‌وری." },
];

export interface FlowStep {
  label: string;
  icon: IconKey;
}

export const flowSteps: FlowStep[] = [
  { label: "مخاطب", icon: "users" },
  { label: "محتوا", icon: "file-video" },
  { label: "تبلیغات", icon: "megaphone" },
  { label: "لید", icon: "user-plus" },
  { label: "هوش مصنوعی", icon: "sparkles" },
  { label: "اتوماسیون", icon: "workflow" },
  { label: "پیگیری", icon: "phone-call" },
  { label: "فروش", icon: "shopping-bag" },
  { label: "تحلیل", icon: "bar-chart" },
  { label: "بهینه‌سازی", icon: "trending-up" },
];

export interface WhyUsItem {
  title: string;
  description: string;
}

export const whyUsItems: WhyUsItem[] = [
  { title: "ترکیب بازاریابی و هوش مصنوعی", description: "بازاریابی خلاق و تکنولوژی هوشمند را جدا نمی‌بینیم؛ قدرت واقعی در ترکیب این دو است." },
  { title: "نگاه سیستمی", description: "به‌جای اجرای جزیره‌ای خدمات، همه‌چیز را به‌عنوان اجزای یک سیستم رشد طراحی می‌کنیم." },
  { title: "تمرکز بر نتیجه", description: "معیار ما شاخص‌هایی است که برای کسب‌وکار شما اهمیت دارند؛ نه تعداد پست و لایک." },
  { title: "اتوماسیون فرایندها", description: "آنچه قابل خودکارسازی است را سیستمی می‌کنیم تا وقت تیم شما برای کارهای مهم آزاد شود." },
  { title: "طراحی راهکار متناسب با کسب‌وکار", description: "بر اساس وضعیت، منابع و اهداف هر کسب‌وکار، راهکار اختصاصی طراحی می‌کنیم؛ نه نسخه‌ی آماده." },
  { title: "استفاده هوشمند از تکنولوژی", description: "از ابزارها و مدل‌های تازه برای سرعت و دقت بیشتر استفاده می‌کنیم؛ نه برای نمایش." },
  { title: "تمرکز روی رشد واقعی", description: "هدف نهایی، رشد پایدار فروش و بهره‌وری است؛ نه شعار." },
];

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "نام را کامل وارد کنید.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{9,10}$/, "شماره تماس معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)."),
  business: z.string().trim().min(2, "نام کسب‌وکار را وارد کنید.").max(120),
  field: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  problem: z.string().trim().min(10, "لطفاً کمی بیشتر توضیح دهید (حداقل ۱۰ کاراکتر).").max(2000),
  services: z.array(z.string()).max(10).optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;