"use client";

export function SectionBackground({
  variant = "default",
  children,
}: {
  variant?: "default" | "dark" | "gradient" | "minimal";
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* لایه پایه پس‌زمینه */}
      <div className="absolute inset-0 bg-ink" />

      {/* گرادیان رادیال اصلی (مثل سکشن بعد از Hero) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-ink to-ink"
      />

      {/* Blob های تزئینی */}
      <div
        aria-hidden="true"
        className="blob -top-24 start-[-8%] size-96 bg-accent/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="blob -bottom-32 end-[-6%] size-[26rem] bg-violet-500/10 blur-[100px]"
      />

      {/* گرید ظریف (اختیاری - برای عمق بیشتر) */}
      <div
        aria-hidden="true"
        className="animated-grid absolute inset-0 opacity-20"
      />

      {/* محتوای سکشن */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}