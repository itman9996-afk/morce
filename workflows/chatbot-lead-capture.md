# Workflow: chatbot-lead-capture (WAT)

## هدف
تبدیل گفت‌وگوی بازدیدکننده به لید تاییدشده — فقط با رضایت صریح — و تحویل امن آن به n8n.

## ورودی‌ها
- پیام کاربر در چت (رشته، ≤2000 نویسه)
- فرم لید داخل چت: name، phone، business?، message?، consent:true، sessionId

## ترتیب اجرا

1. **Agent** (هوش مصنوعی رابط): کاربر می‌پرسد → اگر نیت «درخواست مشاوره» بود → `tools/chat-api` را با تاریخچه صدا می‌زند → پاسخ را نمایش می‌دهد. اگر کاربر اطلاعات تماس داد → `tools/lead-api`.
2. **Tool: app/api/chat (POST)** — اعتبارسنجی + Rate limit (20/5min) + Provider (local/LLM) → reply
3. **Tool: app/api/chat/lead (POST)** — اعتبارسنجی Zod + رضایت اجباری + Rate limit (3/10min) → ذخیره‌ی محلی `.leads/chat-leads.json` → فوروارد اختیاری به n8n
4. **n8n** (workflow.json): Webhook → Validate (Code) → IF valid → Respond 201 / Respond 422 → (اختیاری، اضافه‌ی مشتری: CRM / اعلان / Sheets)

## خروجی مورد انتظار
- پاسخ فارسی کوتاه و درست در چت
- رکورد لید با consent_timestamp و source=website-chatbot در `.leads/chat-leads.json`
- اجرای ثبت‌شده در n8n execution log

## مدیریت خطا
| خطا | رفتار |
|---|---|
| Provider در دسترس نیست | پاسخ محترمانه + شماره تماس؛ status 200 |
| Payload نامعتبر | 400/422 با پیام فارسی |
| Rate limit | 429 با پیام فارسی |
| شکست webhook | لید محلی محفوظ؛ خطا فقط در لاگ سرور؛ n8n execution ناموفق برای retry |
| تکرار اجرای n8n (retry) | گیرنده با lead_id dedupe کند |

## ممنوعیت‌ها
- جمع‌آوری هر داده‌ای بدون فرم رضایت‌دار
- ثبت قیمت، قول، یا قابلیت جدید در پاسخ چت‌بات
- لاگ‌کردن محتوای مکالمه
- عمومی‌کردن پوشه‌ی `.leads/`

## یادگیری و به‌روزرسانی
هر سوال جدیدی که موتور محلی خوب جواب نداد → اینجا ثبت شود → پاسخش به `data/chatbot-knowledge.ts` اضافه شود. سوال‌های پرتکرار، کاندیدای بخش FAQ سایت‌اند.