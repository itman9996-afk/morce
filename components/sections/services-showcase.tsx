"use client";

import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/core";

const serviceCards = [
  {
    id: "nlp-course",
    title: "آموزش NLP به زبان ساده",
    description: "یادگیری پردازش زبان طبیعی با مثال‌های عملی",
    instructor: "پیمان یعقوبی",
    price: "۸,۰۰۰,۰۰۰ تومان",
    href: "/services/nlp",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "ai-model",
    title: "آموزش ساخت مدل اختصاصی هوش مصنوعی",
    description: "ساخت مدل هوش مصنوعی برای هر برند",
    instructor: "پیمان یعقوبی",
    price: "۸,۰۰۰,۰۰۰ تومان",
    href: "/services/ai-model",
    color: "from-purple-600 to-indigo-600",
  },
  {
    id: "clinic-ai",
    title: "تولید محتوا با هوش مصنوعی برای سالن‌ها و کلینیک‌های زیبایی",
    description: "راهکارهای اختصاصی هوش مصنوعی برای صنعت زیبایی",
    instructor: "پیمان یعقوبی",
    price: "۱۰,۰۰۰,۰۰۰ تومان",
    href: "/services/clinic",
    color: "from-emerald-500 to-teal-500",
  },
];

export function ServicesShowcase() {
  const visibleCards = serviceCards.slice(0, 3);

  return (
    <section   id="services"  className="relative py-20 md:py-28 bg-ink overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-ink to-ink" />
      
      <div className="container-site relative z-10 px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          >
            خدمات <span className="gradient-text-light">تخصصی</span> ما
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/70 max-w-2xl mx-auto"
          >
            راهکارهای عملی و سیستم‌های هوشمند برای رشد کسب‌وکار شما
          </motion.p>
        </div>

        <div className="grid gap-8 lg:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card, index) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-80`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="size-20 text-white/50" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 md:p-7">
                <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                  {card.title}
                </h3>
                
                <p className="mt-3 text-sm text-white/60 leading-7">
                  {card.description}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center">
                    <User className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{card.instructor}</p>
                    <p className="text-xs text-white/50">مدرس و متخصص</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="text-lg font-bold text-accent">
                    {card.price}
                  </div>
                  <Button
                    href={card.href}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                  >
                    ثبت نام
                    <ArrowLeft className="size-4" />
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white/70 hover:text-accent transition-colors border-b border-white/20 hover:border-accent pb-1"
          >
            مشاهده همه خدمات
            <ArrowLeft className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}