# SERVICE MEDIA MANIFEST

فهرست کامل رسانه‌های چهار صفحه‌ی خدمت. همه‌ی Visualهای مفهومی با کد ساخته شده‌اند؛
فقط فایل‌های زیر لازم است. تا وقتی فایلی نباشد، جای‌گیر گرادیانی نشان داده می‌شود و سایت سالم است.

## ویدیوها — P0 (ضروری)

| PAGE | SECTION | FILE NAME | TYPE | PURPOSE | RATIO | PRIORITY | STATUS |
|---|---|---|---|---|---|---|---|
| AI | Hero | ai-business-intelligence.mp4 | Video | AI Business Intelligence | 16:9 | P0 | NEEDED |
| AI Content | Hero | ai-content-production.mp4 | Video | Content Production Pipeline | 16:9 | P0 | NEEDED |
| Automation | Hero | business-automation-workflow.mp4 | Video | Lead → AI → CRM Flow | 16:9 | P0 | NEEDED |
| Digital Marketing | Hero | digital-growth-system.mp4 | Video | Ad → Landing → Lead → Conversion | 16:9 | P0 | NEEDED |

مسیر: `public/videos/` — پوسترها (P1، اختیاری): همان نام + `-poster.jpg`

## تصاویر — P1 (مهم)

| PAGE | SECTION | FILE NAME | TYPE | PURPOSE | RATIO | PRIORITY | STATUS |
|---|---|---|---|---|---|---|---|
| AI Content | Content Ecosystem | content-reels.webp | Image | Reels Production | 4:5 | P1 | NEEDED |
| AI Content | Content Ecosystem | content-video-production.webp | Image | Video Production | 4:5 | P1 | NEEDED |
| AI Content | Content Ecosystem | content-photography.webp | Image | Photography | 4:5 | P1 | NEEDED |
| AI Content | Content Ecosystem | content-ugc.webp | Image | UGC Content | 4:5 | P1 | NEEDED |
| AI Content | Before/After | content-before.webp | Image | Raw Content | 16:10 | P1 | NEEDED |
| AI Content | Before/After | content-after.webp | Image | Final Content | 16:10 | P1 | NEEDED |

مسیر: `public/images/`

## اختیاری — P2 (اگر خواستی نسخه‌ی عکس هم داشته باشی)

| PAGE | FILE NAME | PURPOSE | STATUS |
|---|---|---|---|
| AI | ai-system.webp | جایگزین عکسِ نقشه‌ی AI (الان با کد ساخته شده) | OPTIONAL |
| AI | ai-crm-dashboard.webp | جایگزین موکاپ CRM (الان با کد ساخته شده) | OPTIONAL |
| Automation | n8n-workflow.webp | جایگزین نمودار n8n (الان با کد ساخته شده) | OPTIONAL |
| Digital Marketing | marketing-dashboard.webp | جایگزین داشبورد نمونه (الان با کد ساخته شده) | OPTIONAL |

## ساخته‌شده با کد — NO MEDIA NEEDED

- AI: نقشه‌ی سیستم (AI Core + ۶ گره)، جریان ایجنت + گفت‌وگوی نمونه، کارت نتیجه
- Automation: سازنده‌ی Workflow با انشعاب، نمودار n8n، سه حوزه‌ی عملیات، مقایسه‌ی دستی/خودکار
- Digital Marketing: موتور رشد، قیف فروش CSS، داشبورد نمونه، سفر ریتارگتینگ

## انکود پیشنهادی ویدیوها

ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset veryfast -g 30 -movflags +faststart -an -vf "scale=-2:1080" OUTPUT.mp4

(P0 = ویدیو ندارد سکشن هیرو خالی نمی‌ماند ولی تجربه ناقص است؛ P1 = بدون آن جای‌گیر می‌آید)