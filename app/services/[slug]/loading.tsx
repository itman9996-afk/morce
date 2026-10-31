/** Skeleton مسیر خدمات — چیدمان مشابه صفحه‌ی واقعی */
export default function ServiceLoading() {
  return (
    <>
      <div className="h-11 border-b border-line bg-white/60" />
      <section className="border-b border-line py-14 md:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="h-7 w-40 animate-pulse rounded-full bg-line" />
            <div className="mt-4 h-12 w-4/5 animate-pulse rounded-xl bg-line" />
            <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-line" />
            <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-line" />
            <div className="mt-8 flex gap-3">
              <div className="h-11 w-36 animate-pulse rounded-full bg-line" />
              <div className="h-11 w-36 animate-pulse rounded-full bg-line" />
            </div>
          </div>
          <div className="aspect-video animate-pulse rounded-[1.5rem] bg-gradient-to-br from-accent/15 via-line to-violet-500/15" />
        </div>
      </section>
      <section className="py-16">
        <div className="container-site">
          <div className="mx-auto h-9 w-64 animate-pulse rounded-xl bg-line" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-line bg-white/70" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}