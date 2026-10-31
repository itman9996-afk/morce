"use client";

/** فرم ورود ادمین — کلید با POST می‌رود، نه در URL */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(data?.message ?? "ورود ناموفق بود.");
        return;
      }
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-5 py-24">
      <form
        onSubmit={submit}
        className="rounded-3xl border border-line bg-white/90 p-8 text-center"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <Lock className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold">ورود به پنل مدیریت</h1>
        <p className="mt-2 text-sm leading-7 text-muted">کلید ادمین را وارد کن — در URL ذخیره نمی‌شود.</p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="کلید ادمین"
          aria-label="کلید ادمین"
          autoComplete="current-password"
          className="input-base mt-6 text-center"
          dir="ltr"
        />
        {error ? (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || !key.trim()}
          className="btn-gradient mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          ورود
        </button>
      </form>
    </section>
  );
}