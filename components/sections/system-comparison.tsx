import { Container, Reveal, SectionHeading } from "@/components/ui/core";

export function SystemComparisonSection() {
  return (
    <section className="relative bg-ink py-20 md:py-28 overflow-hidden">
      {/* ✅ افکت‌های پس‌زمینه بنفش درخشان و زنده */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-ink to-ink" />
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-violet-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full" />
      
      <Container className="relative z-10">
        <Reveal>
          <SectionHeading
            id="comparison-title"
            eyebrow="مقایسه سیستم"
            title="روش سنتی یا سیستم هوشمند؟"
            description="تفاوت این دو روش مثل تفاوت دوچرخه و ماشین است. هر دو شما را جابه‌جا می‌کنند، اما یکی سرعت، راحتی و مقیاس‌پذیری دیگری را ندارد."
          />
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-red-400">روش سنتی</h3>
              <ul className="mt-6 space-y-4">
                {["تبلیغات بدون تحلیل و بهینه‌سازی", "پاسخ‌دهی کند و دستی به مشتریان", "فرایندهای زمان‌بر و پرخطا", "داده‌های پراکنده و بلااستفاده", "هزینه‌های غیرقابل ردیابی"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-green-400">سیستم هوشمند</h3>
              <ul className="mt-6 space-y-4">
                {["کمپین‌های داده‌محور و بهینه‌شده", "پاسخ‌گویی خودکار و ۲۴ ساعته", "فرایندهای خودکار و بدون خطا", "داده‌های یکپارچه و قابل تحلیل", "هزینه‌های کاملاً ردیابی‌شده"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-green-400" />
                    <span>{item}</span>
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