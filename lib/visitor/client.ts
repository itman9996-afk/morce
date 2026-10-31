/**
 * ابزارهای سمت مرورگر برای Visitor Intelligence
 *  - visitor_id: تصادفی، دائمی در localStorage — هیچ داده‌ی شخصی ندارد
 *  - session_id: تصادفی، به‌ازای هر تب/جلسه در sessionStorage
 *  - UTM: فقط از URL خود بازدیدکننده خوانده می‌شود؛ چیزی حدس زده نمی‌شود
 */

const VID_KEY = "abbas-vid";
const SID_KEY = "abbas-sid";
const UTM_KEY = "abbas-utm";

function randomId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  }
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(VID_KEY);
  if (!id) {
    id = randomId("v");
    localStorage.setItem(VID_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SID_KEY);
  if (!id) {
    id = randomId("s");
    sessionStorage.setItem(SID_KEY, id);
  }
  return id;
}

export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/** UTM فقط یک‌بار در هر جلسه از URL ثبت می‌شود و در جلسه حفظ می‌شود */
export function getUtm(): UtmData | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = sessionStorage.getItem(UTM_KEY);
    if (saved) return JSON.parse(saved) as UtmData;

    const params = new URLSearchParams(window.location.search);
    const pick = (k: string) => params.get(k)?.slice(0, 120) || undefined;
    const utm: UtmData = {
      utm_source: pick("utm_source"),
      utm_medium: pick("utm_medium"),
      utm_campaign: pick("utm_campaign"),
      utm_term: pick("utm_term"),
      utm_content: pick("utm_content"),
    };
    if (Object.values(utm).some(Boolean)) {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
      return utm;
    }
    return null;
  } catch {
    return null;
  }
}