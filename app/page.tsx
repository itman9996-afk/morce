import { Hero3DExperience } from "@/components/sections/hero-3d";
import { NeuralFlowSection } from "@/components/sections/neural-flow";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { SystemComparisonSection } from "@/components/sections/system-comparison";


// ✅ فقط CoreSystemSection را ایمپورت می‌کنیم (FlowSection یا همان جریان کار حذف شد)
import { CoreSystemSection } from "@/components/sections/system";

import { SystemBuilderSection } from "@/components/sections/system-builder";

// ✅ فقط ServicesSection و ProcessSection را ایمپورت می‌کنیم (IndustriesSection یا همان صنایع حذف شد)
import { ServicesSection, ProcessSection } from "@/components/sections/offerings";

import { AnalyzePromo } from "@/components/sections/analyze-promo";
import { PlansSection } from "@/components/sections/plans";

// ✅ اضافه کردن نمونه کارها
import { ShowcaseSection } from "@/components/sections/projects-gallery";

import { WhyUsSection, CtaSection } from "@/components/sections/proof-contact";
import { FaqSection } from "@/components/sections/faq";

export default function HomePage() {
  return (
    <>
      <Hero3DExperience />

      <NeuralFlowSection/>
      
      <ServicesShowcase />
      {/* ... بقیه سکشن‌ها ... */}

      <SystemComparisonSection />
      
      {/* ✅ نمونه کارها دقیقاً قبل از "چرا سیستم" قرار گرفت */}
      <ShowcaseSection /> 
      
      <CoreSystemSection /> {/* چرا سیستم */}
      <SystemBuilderSection /> {/* بازی بساز */}
      <ServicesSection /> {/* خدمات */}
      <AnalyzePromo /> {/* آنالیز */}
      <PlansSection /> {/* پلن‌ها */}
      <ProcessSection /> {/* فرایند کار */}
      
      {/* ✅ صنایع (IndustriesSection) و جریان کار (FlowSection) حذف شدند */}
      
      <WhyUsSection /> {/* چرا ما */}
      <CtaSection /> {/* فراخوان نهایی */}
      <FaqSection /> {/* سوالات متداول */}
    </>
  );
}