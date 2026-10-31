import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Download, Lock, LogOut, Phone, RefreshCcw, ShieldCheck, Users } from "lucide-react";
import { AdminLoginForm } from "./login-form";
import { listLeads, readVisitors, countEvents } from "@/lib/visitor/server";

export const metadata: Metadata = {
  title: "پنل لیدها — مدیریت",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function fa(n: number): string {
  return n.toLocaleString("fa-IR");
}

function faDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default async function AdminLeadsPage() {
  /* احراز هویت از کوکی httpOnly — کلید در URL و لاگ‌ها نیست */
  const adminKey = process.env.ADMIN_KEY;
  const store = await cookies();
  const authorized = !!adminKey && store.get("admin_session")?.value === adminKey;

  if (!adminKey) {
    return (
      <section className="mx-auto max-w-xl px-5 py-24">
        <div className="rounded-3xl border border-line bg-white/90 p-8 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Lock className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">راه‌اندازی لازم است</h1>
          <div className="mt-4 rounded-2xl border border-dashed border-accent/40 bg-accent-soft/30 p-5 text-start text-sm leading-7 text-ink/85">
            <p>در فایل <code dir="ltr">.env.local</code> این خط را اضافه کن و سرور را ری‌استارت کن:</p>
            <code dir="ltr" className="mt-2 block rounded-lg bg-ink px-3 py-2 text-xs text-white">ADMIN_KEY=یک-کلید-مخفی-خودت</code>
          </div>
        </div>
      </section>
    );
  }

  if (!authorized) {
    return <AdminLoginForm />;
  }

  const [leads, visitors, events] = await Promise.all([listLeads(), readVisitors(), countEvents()]);
  const visitorList = Object.values(visitors);
  const chatCount = leads.filter((l) => l.source === "chat").length;
  const formCount = leads.length - chatCount;
  const leadVisitors = visitorList.filter((v) => v.lead_status === "lead").length;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="card-fancy rounded-3xl border border-line bg-white/90 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">پنل لیدها و بازدیدکننده‌ها</h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
              <ShieldCheck className="size-4 text-emerald-500" aria-hidden="true" />
              دسترسی محافظت‌شده با کوکی امن — کلید در URL ذخیره نمی‌شود
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/api/admin/leads/export?type=leads"
              className="btn-gradient inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white"
            >
              <Download className="size-4" aria-hidden="true" />
              دانلود لیدها (اکسل)
            </a>
            <a
              href="/api/admin/leads/export?type=visitors"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Download className="size-4" aria-hidden="true" />
              دانلود بازدیدکننده‌ها
            </a>
            <a
              href="/admin/leads"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
              aria-label="به‌روزرسانی"
            >
              <RefreshCcw className="size-4" aria-hidden="true" />
            </a>
            <form action="/api/admin/auth" method="post">
              {/* خروج با حذف کوکی — از طریق فرم با متد DELETE در کلاینت انجام می‌شود؛ لینک ساده‌ی زیر جایگزین است */}
            </form>
            <LogoutButton />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { label: "کل لیدها", value: leads.length, Icon: Phone },
            { label: "از چت‌بات", value: chatCount, Icon: Phone },
            { label: "از فرم", value: formCount, Icon: Phone },
            { label: "بازدیدکننده", value: visitorList.length, Icon: Users },
            { label: "لیدشده از بازدید", value: leadVisitors, Icon: Users },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="rounded-2xl border border-line bg-background/80 p-4 text-center">
              <Icon className="mx-auto size-4 text-accent" aria-hidden="true" />
              <p className="mt-1.5 text-xl font-black text-ink">{fa(value)}</p>
              <p className="text-[0.65rem] text-muted">{label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-end text-[0.65rem] text-muted">رویدادهای ثبت‌شده: {fa(events)}</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-white/90">
        <div className="border-b border-line px-6 py-4">
          <h2 className="font-bold">لیست لیدها — جدیدترین اول</h2>
        </div>
        {leads.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">
            هنوز لیدی ثبت نشده. اولین درخواست که از فرم یا چت‌بات بیاید، همین‌جا می‌بینی.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-line bg-background/60 text-start text-xs text-muted">
                  <th className="px-4 py-3 text-start font-medium">نام</th>
                  <th className="px-4 py-3 text-start font-medium">شماره</th>
                  <th className="px-4 py-3 text-start font-medium">کسب‌وکار</th>
                  <th className="px-4 py-3 text-start font-medium">پیام</th>
                  <th className="px-4 py-3 text-start font-medium">منبع</th>
                  <th className="px-4 py-3 text-start font-medium">زمان</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={`${lead.phone}-${i}`} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink">{lead.name}</td>
                    <td dir="ltr" className="px-4 py-3 text-start font-semibold text-accent">{lead.phone}</td>
                    <td className="px-4 py-3 text-ink/80">{lead.business ?? "—"}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-muted" title={lead.message ?? ""}>
                      {lead.message ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          lead.source === "chat"
                            ? "rounded-full bg-accent-soft px-2.5 py-0.5 text-[0.65rem] font-semibold text-accent"
                            : "rounded-full bg-emerald-50 px-2.5 py-0.5 text-[0.65rem] font-semibold text-emerald-700"
                        }
                      >
                        {lead.source === "chat" ? "چت‌بات" : "فرم"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{faDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies } = await import("next/headers");
        const store = await cookies();
        store.delete("admin_session");
        const { redirect } = await import("next/navigation");
        redirect("/admin/leads");
      }}
    >
      <button
        type="submit"
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-semibold text-muted transition-colors hover:border-red-300 hover:text-red-600"
      >
        <LogOut className="size-3.5" aria-hidden="true" />
        خروج
      </button>
    </form>
  );
}