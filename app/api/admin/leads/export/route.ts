import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listLeads, readVisitors, leadsToCsv, visitorsToCsv } from "@/lib/visitor/server";

/**
 * خروجی CSV ادمین — احراز هویت از کوکی httpOnly (نه query string)
 * GET /api/admin/leads/export?type=leads|visitors
 */

export async function GET(request: Request) {
  const adminKey = process.env.ADMIN_KEY;
  const store = await cookies();
  const authorized = !!adminKey && store.get("admin_session")?.value === adminKey;

  if (!authorized) {
    return NextResponse.json({ ok: false, message: "دسترسی مجاز نیست." }, { status: 401 });
  }

  const type = new URL(request.url).searchParams.get("type") ?? "leads";
  const stamp = new Date().toISOString().slice(0, 10);

  if (type === "visitors") {
    const visitors = await readVisitors();
    return new NextResponse(visitorsToCsv(visitors), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="website-visitors-${stamp}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const leads = await listLeads();
  return new NextResponse(leadsToCsv(leads), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="website-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}