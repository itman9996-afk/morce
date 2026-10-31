import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { flowSteps } from "@/data/content";
import { getIcon } from "@/lib/icons";

export function CoreSystemSection() {
  return (
    // ✅ اضافه کردن relative و overflow-hidden برای کنترل افکت‌های پس‌زمینه
    <section className="relative bg-ink py-20 md:py-28 overflow-hidden">
      
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده (دقیقاً مثل نمونه‌کارها) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/40 via-ink to-ink" />
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-violet-600/30 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-80 h-80 bg-accent/20 blur-[100px] rounded-full" />

      {/* ✅ اضافه کردن relative z-10 برای اینکه محتوا روی افکت‌ها قرار بگیرد */}
      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading 
              eyebrow="چرا سیستم؟" 
              title="رشد تصادفی نیست، مهندسی‌شده است" 
              description="ما به جای تکیه بر شانس یا روش‌های منسوخ، یک اکوسیستم یکپارچه می‌سازیم که بازاریابی، محتوا و فناوری را به هم گره می‌زند تا نتیجه‌ای قابل پیش‌بینی و مقیاس‌پذیر بگیرید." 
            />
          </Reveal>
          <Reveal delay={0.2}>
            {/* ✅ کمی بهبود سایه و بوردر برای هماهنگی بیشتر با پس‌زمینه درخشان */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
              <ul className="space-y-6">
                {[
                  { title: "یکپارچگی", desc: "همه ابزارها و فرایندها با هم صحبت می‌کنند." },
                  { title: "داده‌محوری", desc: "هر تصمیم بر اساس آمار واقعی گرفته می‌شود، نه حدس و گمان." },
                  { title: "مقیاس‌پذیری", desc: "سیستمی که با رشد کسب‌وکار شما، بدون نیاز به نیروی انسانی اضافی، بزرگ‌تر می‌شود." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent shadow-[0_0_15px_-3px_rgba(139,92,246,0.5)]">
                      ✓
                    </span>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="mt-1 text-sm text-white/60">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function FlowSection() {
  return (
    // ✅ اضافه کردن relative و overflow-hidden برای کنترل افکت‌های پس‌زمینه
    <section className="relative bg-ink py-20 md:py-28 overflow-hidden">
      
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent/15 blur-[100px] rounded-full" />

      {/* ✅ اضافه کردن relative z-10 برای اینکه محتوا روی افکت‌ها قرار بگیرد */}
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading 
            align="center" 
            eyebrow="جریان کار" 
            title="چرخه‌ی هوشمند رشد" 
            description="از لحظه‌ی آشنایی مخاطب تا تبدیل او به مشتری وفادار، همه چیز خودکار و بهینه پیش می‌رود." 
          />
        </Reveal>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {flowSteps.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <Reveal key={step.label} delay={i * 0.05}>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 transition-all hover:border-accent/50 hover:bg-white/10 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]">
                  <Icon className="size-5 text-accent" />
                  <span className="text-sm font-medium">{step.label}</span>
                  {i < flowSteps.length - 1 && <span className="ml-2 text-white/30">←</span>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}