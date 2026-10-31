export default function Loading() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24" role="status" aria-label="در حال بارگذاری">
      <div className="flex gap-2" aria-hidden="true">
        <span className="size-3 animate-bounce rounded-full bg-accent/70 [animation-delay:0ms]" />
        <span className="size-3 animate-bounce rounded-full bg-accent/70 [animation-delay:150ms]" />
        <span className="size-3 animate-bounce rounded-full bg-accent/70 [animation-delay:300ms]" />
      </div>
      <p className="text-sm text-muted">در حال بارگذاری…</p>
    </div>
  );
}