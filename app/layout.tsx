import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// ✅ ایمپورت‌های معمولی (بدون dynamic برای جلوگیری از هرگونه هشدار)
import { Header } from "@/components/layout/header";
import { FloatingActions } from "@/components/layout/floating-actions";
import { InteractiveBackground } from "@/components/layout/interactive-background";
import { ChatWidget } from "@/components/chat/chat-widget";
import { VisitorTracker } from "@/components/visitor/visitor-tracker";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import Footer from "@/components/layout/footer";
import CookieBanner from "@/components/ui/cookie-banner";
import MobileCta from "@/components/ui/mobile-cta";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} | ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: siteConfig.name }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#20252B", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [{ "@type": "Organization", name: siteConfig.name, url: siteConfig.url, description: siteConfig.description }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} bg-ink`}>
      <body className="flex min-h-[100dvh] flex-col text-white antialiased">
        <InteractiveBackground />
        <VisitorTracker />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ScrollProgress />
        <Header />
        
        <main id="main" className="flex-1">
          {children}
        </main>
        
        <Footer />
        <FloatingActions />
        <ChatWidget />
        <BackToTop />
        <CookieBanner />
        <MobileCta />
      </body>
    </html>
  );
}