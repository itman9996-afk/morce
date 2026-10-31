/** Skeleton صفحه‌ی تحلیل — هم‌اندازه‌ی فرم واقعی، بدون پرش */
export default function AnalyzeLoading() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-site max-w-3xl">
        <div className="mx-auto h-7 w-48 animate-pulse rounded-full bg-line" />
        <div className="mx-auto mt-5 h-10 w-3/4 animate-pulse rounded-xl bg-line" />
        <div className="mx-auto mt-4 h-4 w-2/3 animate-pulse rounded-full bg-line" />
        <div className="mt-10 rounded-3xl border border-line bg-white/80 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={i === 0 || i === 5 ? "sm:col-span-2" : ""}>
                <div className="mb-2 h-4 w-24 animate-pulse rounded bg-line" />
                <div className="h-11 animate-pulse rounded-xl bg-line" />
              </div>
            ))}
          </div>
          <div className="mt-6 h-12 w-full animate-pulse rounded-full bg-gradient-to-l from-accent/20 to-violet-500/20" />
        </div>
      </div>
    </section>
  );
}