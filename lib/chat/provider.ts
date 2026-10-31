/**
 * Provider Abstraction — لایه‌ی مدل هوش مصنوعی چت‌بات
 *
 *  CHAT_PROVIDER=local  (پیش‌فرض — موتور قاعده‌محور، بدون هزینه و بدون کلید)
 *  CHAT_PROVIDER=mock   (برای تست — بدون هیچ فراخوانی واقعی)
 *  CHAT_PROVIDER=openai-compatible (فقط با env: CHAT_API_BASE، CHAT_API_KEY، CHAT_MODEL)
 *
 * هیچ کلیدی به مرورگر نمی‌رود؛ این فایل فقط سمت سرور import می‌شود.
 */
import {
  buildSystemPrompt,
  chatbotKnowledge,
} from "@/data/chatbot-knowledge";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatProvider {
  name: string;
  reply(messages: ChatMessage[]): Promise<string>;
}

/* ---------------------- ابزار نرمال‌سازی فارسی ---------------------- */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .replace(/[ؤ]/g, "و")
    .replace(/[أإآ]/g, "ا")
    .replace(/\s+/g, " ")
    .trim();
}

function has(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(normalize(w)));
}

/* ---------------------- Provider محلی (رایگان) ---------------------- */

const k = chatbotKnowledge;

const INTENTS: Array<{ match: string[]; reply: () => string }> = [
  {
    match: ["قیمت", "هزینه", "تعرفه", "چقدر", "تومان", "چند پول", "دستمزد"],
    reply: () => k.policies.pricing,
  },
  {
    match: ["پلن", "پکیج", "بسته", "اقتصادی", "طلایی", "الماس", "تعاون"],
    reply: () =>
      "سه پلن همکاری داریم:\n" +
      k.plans.map((p) => `• پلن ${p.name}: ${p.desc}`).join("\n") +
      "\n\nکدام به کسب‌وکارت نزدیک‌تر است؟",
  },
  {
    match: ["ریلز", "محتوا", "ویدیو", "عکس", "ugc", "ادیت", "کلیپ", "استوری"],
    reply: () => {
      const s = k.services[0];
      return `${s.title} — ${s.summary}\nشامل: ${s.items.join("، ")}.`;
    },
  },
  {
    match: ["هوش مصنوعی", "چت بات", "چت‌بات", "چتبات", "ایجنت", "agent", "ai", "ربات"],
    reply: () => {
      const s = k.services[1];
      return `${s.title} — ${s.summary}\nمثلاً: ${s.items.join("، ")}.`;
    },
  },
  {
    match: ["اتوماسیون", "خودکار", "n8n", "ورک فلو", "workflow", "crm", "لید", "پیگیری"],
    reply: () => {
      const s = k.services[2];
      return `${s.title} — ${s.summary}\nشامل: ${s.items.join("، ")}.`;
    },
  },
  {
    match: ["مارکتینگ", "تبلیغ", "رشد", "سئو", "seo", "فروش", "ریتارگتینگ", "افزایش بازدید"],
    reply: () => {
      const s = k.services[3];
      return `${s.title} — ${s.summary}\nشامل: ${s.items.join("، ")}.`;
    },
  },
  {
    match: ["خدمات", "چه کار", "چیکار", "کارها", "سرویس"],
    reply: () =>
      "چهار حوزه‌ی اصلی کار ما:\n" +
      k.services.map((s) => `• ${s.title}`).join("\n") +
      "\n\nدرباره‌ی کدام‌یک توضیح بدهم؟",
  },
  {
    match: ["فرایند", "چطور شروع", "مراحل", "روند", "از کجا"],
    reply: () =>
      "مسیر همکاری ما:\n" + k.process.map((p, i) => `${["۱", "۲", "۳", "۴", "۵"][i]}. ${p}`).join("\n"),
  },
  {
    match: ["سلام", "درود", "وقت بخیر", "هستی", "کدومی", "کی تو"],
    reply: () => k.welcome,
  },
  {
    match: ["مشاوره", "تماس", "شروع همکاری", "همکاری", "قرار بگذاریم"],
    reply: () =>
      `عالی است! می‌توانی همین‌جا درخواست مشاوره ثبت کنی (دکمه‌ی «ثبت درخواست مشاوره») یا مستقیم تماس بگیری: ${k.brand.phone}`,
  },
  {
    match: ["درباره", "کی هستید", "معرفی"],
    reply: () =>
      `${k.brand.name} — ${k.brand.tagline}. کار ما ساختن «سیستم رشد» است: محتوا، هوش مصنوعی، اتوماسیون و بازاریابی که با هم متصل‌اند، نه جزیره‌ای.`,
  },
];

function escapeTriggered(text: string): string | null {
  const n = normalize(text);
  for (const f of k.forbiddenTopics) {
    if (n.includes(normalize(f.split(" ")[0])) && n.includes(normalize(f.split(" ").pop() ?? ""))) {
      return k.policies.unsupported;
    }
  }
  if (/(پرامپت|system prompt|دستور سیستم|کلید api|token)/i.test(n)) {
    return k.policies.unsupported;
  }
  for (const t of k.escalation.triggers) {
    if (n.includes(normalize(t))) {
      return k.escalation.reply.replace("{phone}", k.brand.phone);
    }
  }
  return null;
}

class LocalRuleProvider implements ChatProvider {
  name = "local-rules";

  async reply(messages: ChatMessage[]): Promise<string> {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return k.welcome;

    const escape = escapeTriggered(lastUser.content);
    if (escape) return escape;

    const n = normalize(lastUser.content);

    for (const intent of INTENTS) {
      if (has(n, intent.match)) {
        return intent.reply();
      }
    }

    // هیچ intentای نخورد → صادقانه + راهنمایی
    return k.policies.unknown;
  }
}

/* ---------------------- Mock (تست) ---------------------- */

class MockProvider implements ChatProvider {
  name = "mock";
  async reply(messages: ChatMessage[]): Promise<string> {
    const last = [...messages].reverse().find((m) => m.role === "user");
    return `[MOCK] پاسخ تستی برای: ${last?.content.slice(0, 60) ?? "خالی"}`;
  }
}

/* ------------- OpenAI-Compatible (اختیاری — فقط با env) ------------- */

class OpenAICompatibleProvider implements ChatProvider {
  name = "openai-compatible";
  private base = process.env.CHAT_API_BASE ?? "";
  private key = process.env.CHAT_API_KEY ?? "";
  private model = process.env.CHAT_MODEL ?? "";

  async reply(messages: ChatMessage[]): Promise<string> {
    if (!this.base || !this.key || !this.model) {
      throw new Error("CHAT_API_BASE / CHAT_API_KEY / CHAT_MODEL تنظیم نشده است — fallback به local");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    try {
      const res = await fetch(`${this.base.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.key}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          temperature: 0.4,
          max_tokens: 320,
          messages: [{ role: "system", content: buildSystemPrompt() }, ...messages.slice(-10)],
        }),
      });

      if (!res.ok) throw new Error(`provider ${res.status}`);

      const data = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) throw new Error("پاسخ خالی از Provider");
      return content;
    } finally {
      clearTimeout(timeout);
    }
  }
}

/* ---------------------- انتخاب Provider ---------------------- */

export function getProvider(): ChatProvider {
  const kind = (process.env.CHAT_PROVIDER ?? "local").toLowerCase();
  if (kind === "mock") return new MockProvider();
  if (kind === "openai-compatible") {
    const p = new OpenAICompatibleProvider();
    // اگر env ناقص بود، بی‌سروصدا به local برمی‌گردیم — سایت هرگز نمی‌شکند
    if (process.env.CHAT_API_BASE && process.env.CHAT_API_KEY && process.env.CHAT_MODEL) {
      return p;
    }
    console.warn("[chat] openai-compatible ناقص پیکربندی شده — local استفاده می‌شود");
  }
  return new LocalRuleProvider();
}

export const GRACEFUL_FALLBACK =
  "الان در پاسخ‌گویی به مشکل خوردم. 🙏 می‌توانی چند لحظه بعد دوباره بپرسی، یا مستقیم تماس بگیری: " +
  chatbotKnowledge.brand.phone;