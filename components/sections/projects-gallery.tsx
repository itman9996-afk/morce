"use client";

/**
 * گالری نمونه‌کار — با پوسترهای واقعی (showcase-*-poster.jpg)
 *  - تا کلیک کاربر: هیچ ویدیویی دانلود/پخش نمی‌شود؛ فقط پوستر + دکمه‌ی پخش
 *  - عنوان درشت و دکمه‌ی مشخص (سبک کارت‌های دوره‌ی حرفه‌ای)
 *  - فقط یک ویدیو هم‌زمان پخش می‌شود
 */
import { SectionBackground } from "@/components/ui/section-background";
import { useRef, useState } from "react";
import { Play, Wand2 } from "lucide-react";
import { Container, Reveal, SectionHeading } from "@/components/ui/core";
import { SiteImage } from "@/components/ui/site-image";
import { showcaseVideos, type ShowcaseVideo } from "@/data/media";
import { cn, trackEvent } from "@/lib/site-config";

type PlayEvent = React.SyntheticEvent<HTMLVideoElement>;

function ShowcaseCard({
  video,
  active,
  onActivate,
  onPlay,
}: {
  video: ShowcaseVideo;
  active: boolean;
  onActivate: () => void;
  onPlay: (e: PlayEvent) => void;
}) {
  return (
    // ✅ تغییر bg-white/90 به bg-white/5 و border-line به border-white/10
    <figure className="card-glow group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm">
      <div className="relative aspect-video overflow-hidden bg-ink">
        {active ? (
          <video
            src={video.videoSrc}
            controls
            playsInline
            preload="none"
            autoPlay
            className="absolute inset-0 h-full w-full object-contain"
            onPlay={onPlay}
            aria-label={video.title}
          />
        ) : (
          <>
            <SiteImage
              asset={{ src: video.posterSrc, alt: `پیش‌نمایش ${video.title}` }}
              fit="cover"
              className="absolute inset-0 rounded-none border-0"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
            <span className="absolute start-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs text-white backdrop-blur-sm">
              <Wand2 className="size-3.5" aria-hidden="true" />
              ساخته‌شده با هوش مصنوعی
            </span>
          </>
        )}
      </div>

      <figcaption className="flex flex-1 flex-col p-5">
        {/* ✅ تغییر bg-accent-soft به bg-accent/10 برای هماهنگی با تم تیره */}
        <span className="w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-[0.6rem] font-bold text-accent">
          {video.tag}
        </span>
        {/* ✅ تغییر text-ink به text-white */}
        <h3 className="mt-2.5 text-lg font-bold leading-8 text-white">{video.title}</h3>
        {/* ✅ تغییر text-muted به text-white/70 */}
        <p className="mt-1.5 flex-1 text-sm leading-7 text-white/70">{video.description}</p>
        <button
          type="button"
          onClick={onActivate}
          className="btn-gradient mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white"
        >
          <Play className="size-4 translate-x-[1px] rtl:-translate-x-[1px]" aria-hidden="true" />
          {active ? "در حال پخش…" : "پخش ویدیو"}
        </button>
      </figcaption>
    </figure>
  );
}

export function ProjectsGallery({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const pauseOthers = (e: PlayEvent) => {
    wrapRef.current
      ?.querySelectorAll("video")
      .forEach((v) => {
        if (v !== e.currentTarget) v.pause();
      });
  };

  return (
    <div ref={wrapRef} className={cn("grid gap-6 md:grid-cols-3", className)}>
      {showcaseVideos.map((video, i) => (
        <Reveal key={video.id} delay={(i % 3) * 0.06}>
          <ShowcaseCard
            video={video}
            active={activeId === video.id}
            onActivate={() => {
              setActiveId(video.id);
              trackEvent("showcase_play", { id: video.id });
            }}
            onPlay={pauseOthers}
          />
        </Reveal>
      ))}
    </div>
  );
}

export function ShowcaseSection() {
  return (
    // ✅ حذف border-t border-line و اضافه کردن bg-ink
    <section id="projects" className="bg-ink scroll-mt-24 py-20 md:py-28" aria-labelledby="showcase-title">
      <SectionBackground>
        <Container>
          <Reveal>
            <SectionHeading
              id="showcase-title"
              align="center"
              eyebrow="نمونه‌کار"
              title="تیزرهای تبلیغاتی ساخته‌شده برای مشتریان"
              description="برای پخش، روی «پخش ویدیو» بزن — ویدیوها فقط با کلیک شما بارگذاری می‌شوند."
            />
          </Reveal>
          <ProjectsGallery className="mt-12" />
        </Container>
      </SectionBackground>
    </section>
  );
}