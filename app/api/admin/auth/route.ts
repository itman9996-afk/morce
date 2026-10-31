import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * احراز هویت ادمین — کلید دیگر هرگز در URL/لاگ نمی‌رود:
 *  POST /api/admin/auth  { key }  → درست بود: کوکی httpOnly می‌سازد (۸ ساعت)
 *  GET   /api/admin/auth          → فقط { loggedIn: true/false } — کلید برنمی‌گردد
 *  DELETE /api/admin/auth         → خروج
 */

const COOKIE = "admin_session";

function makeCookieValue(key: string): string {
  // مقدار کوکی = کلید (سرور آن را با ADMIN_KEY مقایسه می‌کند) —
  // امن‌تر از توکن مشتق بدون secret جدا؛ اما httpOnly و بدون انتقال به JS کلاینت.
  return key;
}

export async function GET() {
  const store = await cookies();
  const valid = !!process.env.ADMIN_KEY && store.get(COOKIE)?.value === process.env.ADMIN_KEY;
  return NextResponse.json({ ok: true, loggedIn: valid });
}

export async function POST(request: Request) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return NextResponse.json(
      { ok: false, message: "ADMIN_KEY در سرور تنظیم نشده است." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "درخواست نامعتبر است." }, { status: 400 });
  }

  const key =
    typeof (body as { key?: unknown })?.key === "string"
      ? (body as { key: string }).key.trim()
      : "";

  if (key !== adminKey) {
    // تاخیر کوتاه برای خنثی‌کردن حمله‌ی brute-force ساده
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, message: "کلید نادرست است." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeCookieValue(adminKey), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  return res;
}