"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

export default function MobileCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-ink/95 p-3 backdrop-blur-md md:hidden">
      <Link
        href="/contact"
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-violet-500 py-3 text-sm font-bold text-white shadow-lg"
      >
        <Phone className="size-4" />
        درخواست مشاوره رایگان
      </Link>
    </div>
  );
}