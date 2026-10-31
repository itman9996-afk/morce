"use client";

/**
 * ChatWidget — نسخه‌ی ۲: نرم، کشیده، اسکرول درست
 *
 *  - باریک‌تر و بلندتر: w=22rem / h تا 80dvh
 *  - نوار پاسخ‌های سریع دائمی بالای ورودی (دیگر گم نمی‌شود)
 *  - اسکرول هوشمند: فقط وقتی کاربر ته چت است خودکار پایین می‌رود؛
 *    وگرنه دکمه‌ی «برو به پایین» ظاهر می‌شود — بدون پرش و به‌هم‌ریختگی
 *  - ورودی و چیپ‌ها همیشه ثابت پایین؛ فقط ناحیه‌ی پیام‌ها اسکرول دارد
 *  - ظاهر نرم: حباب‌های گرادیانی، انیمیشن ورود پیام، هدر با نقطه‌ی آنلاین تپنده
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  CircleCheck,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { chatbotKnowledge as k } from "@/data/chatbot-knowledge";
import { cn } from "@/lib/site-config";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

type Status = "idle" | "loading" | "error";

const SESSION_KEY = "abbas-chat-session";

/** پاسخ‌های سریع دائمی — مورد آخر فرم مشاوره را باز می‌کند */
const QUICK_REPLIES = [
  "چه خدماتی دارید؟",
  "هزینه چطور محاسبه می‌شود؟",
  "فرایند همکاری چطوره؟",
  "درخواست مشاوره",
];

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: k.welcome }]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [atBottom, setAtBottom] = useState(true);

  const [mode, setMode] = useState<"chat" | "lead" | "done">("chat");
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", business: "", message: "" });
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef("");

  useEffect(() => {
    sessionId.current = getSessionId();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* اسکرول هوشمند — فقط وقتی کاربر ته چت است */
  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 120);
  };

  useEffect(() => {
    if (atBottom) scrollToBottom(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status, mode]);

  const send = useCallback(
    async (text: string, append = true) => {
      const clean = text.trim();
      if (!clean || status === "loading") return;

      const history = append ? [...messages, { role: "user" as const, content: clean }] : messages;
      if (append) {
        setMessages(history);
        setInput("");
        setAtBottom(true);
      }
      setStatus("loading");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-12) }),
        });
        if (!res.ok) throw new Error(`chat ${res.status}`);
        const data = (await res.json()) as { reply?: string };
        if (!data.reply) throw new Error("پاسخ خالی");
        setMessages((m) => [...m, { role: "assistant", content: data.reply as string }]);
        setStatus("idle");
      } catch {
        setStatus("error");
      }
    },
    [messages, status]
  );

  const submitLead = async () => {
    if (!consent) {
      setFormError("برای ثبت درخواست، تیک رضایت لازم است.");
      return;
    }
    if (form.name.trim().length < 2 || !/^(\+98|0)9\d{9}$/.test(form.phone.trim())) {
      setFormError("نام و شماره موبایل معتبر (09xxxxxxxxx) لازم است.");
      return;
    }
    setFormError(null);
    setLeadStatus("loading");
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent: true, sessionId: sessionId.current }),
      });
      if (!res.ok) throw new Error(`lead ${res.status}`);
      setMode("done");
      setLeadStatus("idle");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "✅ درخواستت ثبت شد! تیم در اولین فرصت با تو تماس می‌گیرد." },
      ]);
      setAtBottom(true);
    } catch {
      setLeadStatus("error");
    }
  };

  const inputDisabled = status === "loading";

  return (
    <>
      {/* دکمه‌ی شناور */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="باز کردن چت پشتیبانی"
          className="btn-gradient group fixed bottom-5 start-5 z-[70] flex size-14 items-center justify-center rounded-full text-white shadow-[0_16px_40px_-10px_rgba(83,103,217,0.8)] transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="size-6 transition-transform group-hover:-rotate-6" aria-hidden="true" />
          <span aria-hidden="true" className="absolute -top-0.5 -end-0.5 flex size-3.5 rounded-full bg-emerald-400 ring-2 ring-background">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          </span>
        </button>
      ) : null}

      {/* پنل چت */}
      {open ? (
        <motion.div
          role="dialog"
          aria-label="چت پشتیبانی"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-5 start-5 z-[70] flex h-[min(42rem,80dvh)] w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_40px_100px_-24px_rgba(32,37,43,0.5)]"
        >
          {/* هدر گرادیانی */}
          <div className="relative flex items-center justify-between bg-gradient-to-l from-accent to-violet-500 px-4 py-3.5 text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(200px 80px at 85% 0%, rgba(255,255,255,0.35), transparent 70%)" }}
            />
            <div className="relative flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
                <Bot className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold">دستیار {k.brand.name}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[0.65rem] text-white/80">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-300" />
                  </span>
                  آنلاین — معمولاً بلافاصله جواب می‌دهد
                </span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن چت"
              className="relative rounded-full p-1.5 transition-colors hover:bg-white/20"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* ناحیه‌ی پیام‌ها — تنها بخش اسکرول‌دار */}
          <div className="relative min-h-0 flex-1">
            <div
              aria-hidden="true"
              className="dots-light pointer-events-none absolute inset-0 opacity-30"
            />
            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="relative h-full space-y-3.5 overflow-y-auto px-4 pb-3 pt-4"
              aria-live="polite"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn("flex items-end gap-2", m.role === "user" ? "justify-start" : "justify-end")}
                >
                  {m.role === "assistant" ? (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white shadow-[0_4px_10px_-3px_rgba(83,103,217,0.6)]">
                      <Bot className="size-3.5" aria-hidden="true" />
                    </span>
                  ) : null}

                  <div
                    className={cn(
                      "max-w-[82%] whitespace-pre-line px-3.5 py-2.5 text-sm leading-7",
                      m.role === "user"
                        ? "chip-gradient rounded-2xl rounded-bl-md text-white shadow-[0_8px_20px_-8px_rgba(83,103,217,0.65)]"
                        : "rounded-2xl rounded-br-md border border-line bg-white text-ink shadow-[0_4px_14px_-8px_rgba(32,37,43,0.25)]"
                    )}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {/* تایپ */}
              {status === "loading" ? (
                <div className="flex justify-end">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-br-md border border-line bg-white px-4 py-3 shadow-[0_4px_14px_-8px_rgba(32,37,43,0.25)]">
                      <span className="size-1.5 animate-bounce rounded-full bg-accent/70" />
                      <span className="size-1.5 animate-bounce rounded-full bg-accent/70 [animation-delay:120ms]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-accent/70 [animation-delay:240ms]" />
                    </div>
                    <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet-500 text-white">
                      <Bot className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              ) : null}

              {/* خطا + تلاش مجدد */}
              {status === "error" ? (
                <div className="flex justify-end">
                  <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                    ارسال نشد.
                    <button
                      type="button"
                      onClick={() => send("", false)}
                      className="inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      تلاش مجدد
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* دکمه‌ی برو به پایین — فقط وقتی کاربر بالا است */}
            <AnimatePresence>
              {!atBottom ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  onClick={() => scrollToBottom(true)}
                  aria-label="برو به آخرین پیام"
                  className="absolute bottom-3 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-white/95 text-accent shadow-lg backdrop-blur transition-transform hover:scale-105"
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>

          {/* پایین ثابت: فرم لید / موفقیت / چیپ‌ها + ورودی */}
          <div className="border-t border-line bg-white">
            {mode === "lead" ? (
              <div className="p-4">
                <p className="text-xs leading-6 text-muted">{k.leadForm.intro}</p>
                <div className="mt-3 space-y-2.5">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="نام *"
                    aria-label="نام"
                    className="input-base h-10"
                  />
                  <input
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="09xxxxxxxxx *"
                    aria-label="شماره موبایل"
                    className="input-base h-10 text-end"
                  />
                  <input
                    type="text"
                    value={form.business}
                    onChange={(e) => setForm((f) => ({ ...f, business: e.target.value }))}
                    placeholder="نام کسب‌وکار (اختیاری)"
                    aria-label="نام کسب‌وکار"
                    className="input-base h-10"
                  />
                  <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-accent-soft/50 p-2.5 text-[0.7rem] leading-5 text-ink/85">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 size-4 accent-[#5367d9]"
                    />
                    <span>
                      <ShieldCheck className="me-1 inline size-3.5 text-accent" aria-hidden="true" />
                      {k.leadForm.consentText}
                    </span>
                  </label>

                  {formError ? (
                    <p role="alert" className="text-[0.7rem] text-red-600">{formError}</p>
                  ) : null}
                  {leadStatus === "error" ? (
                    <p role="alert" className="text-[0.7rem] text-red-600">
                      ارسال نشد — دوباره تلاش کن یا مستقیم تماس بگیر: {k.brand.phone}
                    </p>
                  ) : null}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={submitLead}
                      disabled={leadStatus === "loading"}
                      className="btn-gradient inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {leadStatus === "loading" ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      ) : null}
                      ثبت درخواست
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("chat")}
                      className="h-10 rounded-full border border-line px-4 text-sm text-muted transition-colors hover:text-ink"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </div>
            ) : mode === "done" ? (
              <div className="flex items-center justify-between gap-2 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                  <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
                  ثبت شد! سوال دیگری داری، بپرس.
                </div>
                <button
                  type="button"
                  onClick={() => setMode("chat")}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  بازگشت به گفتگو
                </button>
              </div>
            ) : (
              <>
                {/* نوار پاسخ‌های سریع — دائمی */}
                <div className="flex gap-1.5 overflow-x-auto px-3 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        if (q === "درخواست مشاوره") setMode("lead");
                        else send(q);
                      }}
                      disabled={inputDisabled}
                      className="whitespace-nowrap rounded-full border border-accent/30 bg-accent-soft/50 px-3 py-1.5 text-xs font-medium text-accent transition-all hover:bg-accent hover:text-white disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* ورودی */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2 p-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="سوالت را بنویس…"
                    aria-label="متن پیام"
                    maxLength={2000}
                    className="input-base h-11 flex-1 rounded-full"
                  />
                  <button
                    type="submit"
                    disabled={inputDisabled || !input.trim()}
                    aria-label="ارسال پیام"
                    className="btn-gradient flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-[0_8px_20px_-8px_rgba(83,103,217,0.7)] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {status === "loading" ? (
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="size-5 -scale-x-100" aria-hidden="true" />
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      ) : null}
    </>
  );
}