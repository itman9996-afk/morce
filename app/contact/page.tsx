"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
  Building2,
  AlertCircle,
  Instagram,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/core"; // مطمئن شو این کامپوننت دکمه رو داری

// ✅ اعتبارسنجی فرم با Zod
const contactSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(50, "نام طولانی است"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
  email: z.string().email("فرمت ایمیل صحیح نیست"),
  company: z.string().optional(),
  service: z.string().min(1, "لطفاً یک خدمت انتخاب کنید"),
  message: z.string().min(10, "پیام باید حداقل ۱۰ کاراکتر باشد").max(1000, "پیام خیلی طولانی است"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const services = [
  { id: "marketing", label: "بازاریابی دیجیتال و رشد" },
  { id: "ai-automation", label: "اتوماسیون با هوش مصنوعی" },
  { id: "content", label: "تولید محتوا و برندینگ" },
  { id: "chatbot", label: "طراحی چت‌بات و سیستم‌های پاسخگو" },
  { id: "other", label: "سایر موارد / مشاوره کلی" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در ارسال فرم");
      }

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید یا تماس بگیرید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-ink py-20 md:py-28" dir="rtl">
      {/* پس‌زمینه تزئینی */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-ink to-ink" />
      <div aria-hidden="true" className="blob -top-24 start-[-8%] size-96 bg-accent/10 blur-[100px]" />
      <div aria-hidden="true" className="blob -bottom-32 end-[-6%] size-[26rem] bg-violet-500/10 blur-[100px]" />

      <div className="container-site relative z-10 mx-auto max-w-6xl px-4">
        {/* هدر صفحه */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-accent"
          >
            <ArrowRight className="size-4" />
            بازگشت به صفحه اصلی
          </Link>

          <h1 className="text-3xl font-bold leading-[1.35] text-white sm:text-4xl lg:text-5xl">
            با ما در <span className="gradient-text-light">تماس</span> باشید
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70 md:text-lg">
            فرم زیر را پر کنید یا از راه‌های ارتباطی مستقیم استفاده کنید. تیم ما در اسرع وقت پاسخگوی شماست.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* ستون اطلاعات تماس (سمت راست در RTL) */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8">
                <h2 className="text-lg font-bold text-white mb-6">راه‌های ارتباطی مستقیم</h2>

                <div className="space-y-4">
                  <a href="tel:09123456789" dir="ltr" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-accent hover:bg-accent/10 group">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white group-hover:scale-110 transition-transform">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">تماس تلفنی</p>
                      <p className="font-semibold text-white text-lg">۰۹۱۲-۳۴۵-۶۷۸۹</p>
                    </div>
                  </a>

                  <a href="mailto:info@yourdomain.com" dir="ltr" className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-accent hover:bg-accent/10 group">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet-500 text-white group-hover:scale-110 transition-transform">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">ایمیل</p>
                      <p className="font-semibold text-white">info@yourdomain.com</p>
                    </div>
                  </a>

                  <div className="flex gap-3 pt-4">
                    <a href="#" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-white/80 transition-all hover:bg-pink-600/20 hover:border-pink-500/50 hover:text-pink-400">
                      <Instagram className="size-5" />
                      <span className="text-sm">اینستاگرام</span>
                    </a>
                    <a href="#" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-white/80 transition-all hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-400">
                      <Linkedin className="size-5" />
                      <span className="text-sm">لینکدین</span>
                    </a>
                    <a href="#" className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-white/80 transition-all hover:bg-sky-600/20 hover:border-sky-500/50 hover:text-sky-400">
                      <MessageSquare className="size-5" />
                      <span className="text-sm">تلگرام</span>
                    </a>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 size-5 shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-white">ساعات پاسخگویی</p>
                      <p className="mt-1 text-xs text-white/60 leading-6">
                        شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر<br />
                        پنجشنبه: ۹ صبح تا ۱ ظهر
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ستون فرم (سمت چپ در RTL) */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8">
              {isSuccess ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center py-10">
                  <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-green-500/20 animate-in zoom-in duration-500">
                    <CheckCircle2 className="size-12 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">پیام شما با موفقیت ارسال شد!</h2>
                  <p className="mt-3 max-w-md text-white/70">
                    کارشناسان ما در اسرع وقت (حداکثر تا ۲ ساعت کاری) با شما تماس خواهند گرفت.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8"
                    onClick={() => setIsSuccess(false)}
                  >
                    ارسال پیام جدید
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <h2 className="text-lg font-bold text-white mb-2">فرم درخواست مشاوره</h2>

                  {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                      <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* نام */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        <User className="mr-1 inline size-4" />
                        نام و نام خانوادگی *
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="مثلاً: علی محمدی"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      />
                      {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
                    </div>

                    {/* تلفن */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        <Phone className="mr-1 inline size-4" />
                        شماره موبایل *
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        dir="ltr"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-left"
                      />
                      {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* ایمیل */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        <Mail className="mr-1 inline size-4" />
                        آدرس ایمیل *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="example@email.com"
                        dir="ltr"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-left"
                      />
                      {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    {/* شرکت */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        <Building2 className="mr-1 inline size-4" />
                        نام شرکت / کسب‌وکار (اختیاری)
                      </label>
                      <input
                        {...register("company")}
                        type="text"
                        placeholder="مثلاً: شرکت نوآوران"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* انتخاب خدمت */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">خدمت مورد نظر شما *</label>
                    <select
                      {...register("service")}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all appearance-none"
                      defaultValue=""
                    >
                      <option value="" disabled className="bg-ink text-white/50">یک گزینه را انتخاب کنید...</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id} className="bg-ink text-white">
                          {s.label}
                        </option>
                      ))}
                    </select>
                    {errors.service && <p className="mt-1.5 text-xs text-red-400">{errors.service.message}</p>}
                  </div>

                  {/* پیام */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      <MessageSquare className="mr-1 inline size-4" />
                      توضیحات و نیاز شما *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="لطفاً درباره کسب‌وکار خود و نیازهایتان به طور خلاصه توضیح دهید..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                    {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>}
                  </div>

                  {/* دکمه ارسال */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="inline-block size-5 animate-spin rounded-full border-2 border-white/30 border-t-white ml-2" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        ارسال درخواست مشاوره
                        <Send className="size-4 mr-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-white/40 mt-4">
                    با ارسال این فرم، با <Link href="/privacy" className="text-accent hover:underline">قوانین حریم خصوصی</Link> ما موافقت می‌کنید.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}