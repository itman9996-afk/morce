
"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ConsultationForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید."
        );
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "خطایی رخ داد. لطفاً دوباره تلاش کنید."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="consultation-name"
          className="mb-2 block text-sm font-medium"
        >
          نام و نام خانوادگی
        </label>
        <input
          id="consultation-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          placeholder="نام خود را وارد کنید"
          className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="consultation-phone"
          className="mb-2 block text-sm font-medium"
        >
          شماره تماس
        </label>
        <input
          id="consultation-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          maxLength={30}
          placeholder="شماره تماس شما"
          className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="consultation-message"
          className="mb-2 block text-sm font-medium"
        >
          توضیحات و درخواست مشاوره
        </label>
        <textarea
          id="consultation-message"
          name="message"
          required
          rows={5}
          maxLength={3000}
          placeholder="کمی درباره نیازتان توضیح دهید..."
          className="w-full resize-y rounded-xl border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "در حال ثبت..." : "درخواست مشاوره"}
      </button>

      {status === "success" && (
        <p role="status" className="text-sm text-green-700">
          درخواست شما با موفقیت ثبت شد.
        </p>
      )}

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
