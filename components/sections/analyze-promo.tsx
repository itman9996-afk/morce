import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui/core";

export function AnalyzePromo() {
  return (
    // ✅ اضافه کردن relative و overflow-hidden برای کنترل افکت‌های پس‌زمینه
    <section className="relative bg-ink py-20 md:py-28 overflow-hidden">
      
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده (دقیقاً مثل نمونه‌کارها) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full" />
      <div className="absolute top-0 left-0 -translate-y-1/3 -translate-x-1/3 w-80 h-80 bg-accent/15 blur-[100px] rounded-full" />

      {/* ✅ اضافه کردن relative z-10 برای اینکه محتوا روی افکت‌های نورانی قرار بگیرد */}
      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            {/* ✅ اضافه کردن backdrop-blur-sm و سایه برای زیباتر شدن کارت روی پس‌زمینه درخشان */}
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 aspect-square flex items-center justify-center backdrop-blur-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
              <BarChart3 className="size-32 text-accent/50" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent rounded-3xl" />
            </div>
          </Reveal>
          
          <Reveal delay={0.2}>
            <SectionHeading 
              eyebrow="تحلیل و آنالیز" 
              title="داده‌ها حرف می‌زنند" 
              description="ما فقط حدس نمی‌زنیم. هر کمپین، هر محتوا و هر فرایند به دقت ردیابی و تحلیل می‌شود تا مطمئن شویم بودجه شما هدر نمی‌رود و بازگشت سرمایه (ROI) به حداکثر می‌رسد." 
            />
            <div className="mt-8">
              <Button href="/contact" size="lg">
                درخواست آنالیز رایگان
                <ArrowLeft className="size-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}