import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z.string().regex(/^09\d{9}$/),
  email: z.string().email(),
  company: z.string().optional(),
  service: z.string().min(1),
  message: z.string().min(10).max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // اعتبارسنجی داده‌ها
    const data = contactSchema.parse(body);

    // 👉 اینجا می‌تونی داده‌ها رو به دیتابیس، ایمیل یا n8n webhook بفرستی
    console.log("📩 پیام جدید از فرم تماس:", data);

    // شبیه‌سازی تاخیر شبکه برای نمایش حالت لودینگ (اختیاری)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json(
      { success: true, message: "پیام با موفقیت دریافت شد" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "اطلاعات وارد شده معتبر نیست. لطفاً فرم را بررسی کنید." },
        { status: 400 }
      );
    }

    console.error("❌ خطا در پردازش فرم تماس:", error);
    return NextResponse.json(
      { success: false, message: "خطایی در سرور رخ داد. لطفاً بعداً تلاش کنید." },
      { status: 500 }
    );
  }
}