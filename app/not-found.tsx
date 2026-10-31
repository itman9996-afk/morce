import Link from "next/link";
import { ArrowLeft, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-20">
      <div aria-hidden="true" className="animated-grid absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="blob -top-24 start-[-6%] size-96" />
      <div aria-hidden="true" className="blob -bottom-32 end-[-5%] size-96" />

      <div className="container-site relative text-center">
        <span className="chip-gradient mx-auto flex size-16 items-center justify-center rounded-3xl text-white shadow-[0_16px_40px_-12px_rgba(83,103,217,0.7)]">
          <Compass className="size-7" aria-hidden="true" />
        </span>
        <p aria-hidden="true" className="mt-6 text-7xl font-black tracking-tight text-ink/10 md:text-9xl">
          ۴۰۴
        </p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">این صفحه پیدا نشد</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-muted">
          آدرسی که وارد کرده‌ای تغییر کرده یا وجود ندارد. از دکمه‌های زیر ادامه بده.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-gradient inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-bold text-white"
          >
            <Home className="size-4" aria-hidden="true" />
            بازگشت به صفحه اصلی
          </Link>
          <Link
            href="/services"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-7 text-sm font-bold text-ink transition-colors hover:border-accent hover:text-accent"
          >
            مشاهده خدمات
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}