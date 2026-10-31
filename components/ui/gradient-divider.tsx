export function GradientDivider() {
  return (
    <div className="relative h-32 md:h-48 w-full overflow-hidden">
      {/* گرادیان از تیره به روشن و دوباره تیره */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-slate-800/50 to-ink" />
      
      {/* خط نورانی وسط */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      
      {/* ذرات نورانی */}
      <div className="absolute top-1/2 left-1/4 size-2 rounded-full bg-accent/30 blur-sm" />
      <div className="absolute top-1/2 left-1/2 size-1 rounded-full bg-violet-400/40 blur-sm" />
      <div className="absolute top-1/2 right-1/4 size-2 rounded-full bg-accent/30 blur-sm" />
    </div>
  );
}