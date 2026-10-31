"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/core";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold text-white">خطایی رخ داد!</h2>
      <p className="mt-4 text-white/70">
        متأسفانه مشکلی در بارگذاری این بخش پیش آمد.
      </p>
      <Button onClick={reset} className="mt-6">
        تلاش مجدد
      </Button>
    </div>
  );
}