"use client";

/**
 * SiteImage — دو حالت نمایش:
 *  - fit="natural" (پیش‌فرض): کل عکس با نسبت واقعی دیده می‌شود — هیچ برشی نمی‌خورد
 *  - fit="cover": قاب ثابت با برش مرکزی — فقط برای جاهایی که قاب مطلق لازم است (پوستر ویدیو، قبل/بعد)
 * اگر فایل نبود یا لود نشد، جای‌گیر گرادیانی شیک نمایش داده می‌شود.
 */
import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/site-config";
import type { SiteImageAsset } from "@/data/media";

interface SiteImageProps {
  asset?: SiteImageAsset;
  /** کلاس کانتینر — در حالت cover نسبت قاب را با aspect-* تعیین کنید */
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  fit?: "cover" | "natural";
}

export function SiteImage({
  asset,
  className,
  imgClassName,
  priority = false,
  sizes = "100vw",
  fit = "natural",
}: SiteImageProps) {
  const [error, setError] = useState(false);

  const fallback = (
    <div
      role="img"
      aria-label={asset?.alt}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-accent-soft via-background to-accent-soft/50",
        className
      )}
    >
      <span aria-hidden="true" className="grid-pattern absolute inset-0 opacity-60" />
      <ImageOff className="size-8 text-accent/40" aria-hidden="true" />
    </div>
  );

  if (!asset || error) return fallback;

  if (fit === "natural") {
    /* کل عکس — بدون برش؛ کانتینر ارتفاع را از خود عکس می‌گیرد */
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border border-line bg-surface",
          className
        )}
      >
        <Image
          src={asset.src}
          alt={asset.alt}
          width={1600}
          height={1000}
          priority={priority}
          onError={() => setError(true)}
          style={{ width: "100%", height: "auto" }}
          className={cn("block", imgClassName)}
        />
      </div>
    );
  }

  /* حالت cover — قاب ثابت (مثلاً aspect-video در className) */
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-surface",
        className
      )}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setError(true)}
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
}