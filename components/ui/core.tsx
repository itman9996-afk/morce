"use client";

/**
 * اجزای پایه‌ی رابط کاربری — نسخه‌ی رنگی (گرادیان)
 */
import { forwardRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/site-config";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container-site", className)} {...props} />;
}

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "btn-gradient text-white shadow-[0_8px_24px_-10px_rgba(83,103,217,0.65)] hover:shadow-[0_12px_32px_-10px_rgba(83,103,217,0.75)] hover:brightness-110",
        secondary: "bg-ink text-white hover:bg-ink/90",
        outline: "border border-line bg-surface text-ink hover:border-accent hover:text-accent",
        ghost: "text-ink hover:bg-ink/5",
        white: "bg-white text-ink hover:bg-accent-soft",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[0.95rem]",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  onClickCapture?: () => void;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, href, children, onClickCapture, ...props },
  ref
) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes} onClickCapture={onClickCapture}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} onClickCapture={onClickCapture} {...props}>
      {children}
    </button>
  );
});

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="chip-gradient mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-[0_6px_18px_-8px_rgba(83,103,217,0.7)]">
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className="text-3xl font-bold leading-[1.3] md:text-4xl lg:text-[2.6rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-muted md:text-lg md:leading-9">
          {description}
        </p>
      ) : null}
    </div>
  );
}

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
}

export function Reveal({ children, delay = 0, y = 24, className, ...props }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export { buttonVariants };