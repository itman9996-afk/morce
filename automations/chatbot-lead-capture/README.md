# پکیج اتوماسیون: chatbot-lead-capture

چت‌بات سایت که بازدیدکننده را راهنمایی می‌کند و لیدهای واجد شرایط را — فقط با رضایت صریح — ثبت و به n8n تحویل می‌دهد.

## ۱. چه مشکلی را حل می‌کند؟
بازدیدکننده‌هایی که سوال دارند ولی فرم کامل را پر نمی‌کنند، در چت جواب می‌گیرند و در لحظه‌ی آماده‌شدن، درخواستشان ثبت می‌شود.

## ۲. ورودی‌ها / خروجی‌ها

**چت (POST /api/chat):** `{ messages: [{role, content}] }` → `{ reply }`
**لید (POST /api/chat/lead):** `{ name, phone, business?, message?, consent:true, sessionId? }` → 201 یا 422

## ۳. یکپارچه‌سازی‌ها و اعتبارنامه‌ها

| یکپارچه‌سازی | اجباری؟ | اعتبارنامه (فقط .env سرور) |
|---|---|---|
| موتور محلی (پیش‌فرض) | خیر — رایگان | — |
| OpenAI-Compatible (اختیاری) | خیر | CHAT_API_BASE، CHAT_API_KEY، CHAT_MODEL |
| n8n Webhook | خیر | LEAD_WEBHOOK_URL، LEAD_WEBHOOK_TOKEN |

## ۴. نصب
1. فایل‌ها را مطابق ساختار پروژه کپی کنید (components/chat، lib/chat، data/chatbot-knowledge.ts، app/api/chat/*)
2. `<ChatWidget />` را به layout اضافه کنید (در نسخه‌ی تحویل‌شده اضافه شده)
3. `.leads/` را به .gitignore اضافه کنید
4. ری‌استارت سرور

## ۵. شخصی‌سازی برای مشتری جدید
فقط `data/chatbot-knowledge.ts` را ویرایش کنید: نام برند، خدمات، پاسخ‌ها، شماره تماس، سیاست قیمت. **کد چت‌بات دست نمی‌خورد.**

## ۶. تست (دستی — بدون هزینه)

```bash
# چت — سوال قیمت
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"قیمت چنده؟"}]}'
# انتظار: پیام سیاست قیمت (بدون هیچ عدد قیمت)

# چت — خارج از حوزه
curl -X POST http://localhost:3000/api/chat -d '{"messages":[{"role":"user","content":"آب و هوا چطوره؟"}]}' -H "Content-Type: application/json"
# انتظار: «خارج از حوزه...»

# لید بدون رضایت → باید 422 بدهد
curl -X POST http://localhost:3000/api/chat/lead -H "Content-Type: application/json" -d '{"name":"علی","phone":"09123456789","consent":false}'

# لید معتبر → 201 + فایل در .leads/chat-leads.json
curl -X POST http://localhost:3000/api/chat/lead -H "Content-Type: application/json" -d '{"name":"علی رضایی","phone":"09123456789","consent":true}'
```

## ۷. مدیریت خطا و بازیابی
- شکست Provider → پاسخ محترمانه + شماره تماس (کاربر نمی‌بیند خطا چه بوده)
- شکست webhook → لید محلی محفوظ می‌ماند؛ n8n بعداً retry دستی دارد (execution log در n8n)
- retry خودکار سمت n8n: گره‌های Retry On Fail برای CRM/نوتیفیکیشن موقع اضافه‌کردن فعال شود (تکرار اعلان = آیدی لید در بدنه؛ سمت گیرنده dedupe کند)

## ۸. امنیت
- اعتبارسنجی Zod سمت سرور + محدودیت نرخ + سقف طول پیام
- کلیدها فقط env سمت سرور — هرگز در باندل مرورگر
- Prompt Injection: قواعد سیستمی جدا از پیام کاربر + فیلتر موضوعات ممنوع در موتور محلی
- هیچ محتوای مکالمه در لاگ نوشته نمی‌شود

## ۹. محدودیت‌های شناخته‌شده (صادقانه)
- موتور محلی intent-based است؛ سوالات خیلی باز را با «نمی‌دانم + پیشنهاد مشاوره» جواب می‌دهد — این عمدی است
- ورک‌فلو n8n تحویل‌شده (Webhook→Validate→IF→Respond) باید بعد از import یک‌بار با curl تست شود — تایید نشده
- ذخیره‌سازی فعلی JSON-Lines است؛ برای چند-هزار لید، SQLite لازم می‌شود (فاز بعد)
- Tenant isolation بین چند مشتری در نسخه فعلی پیاده نشده — هر مشتری deployment جدا بگیرد

## ۱۰. CHANGELOG
- v1.0 — نسخه اول: چت‌بات + API + ثبت لید مکالمه‌ای + پکیج n8n