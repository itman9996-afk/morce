"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export function TiltWrapper({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  // مقادیر حرکتی
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // فنر برای نرم کردن حرکت (هرچه اعداد بالاتر، حرکت سفت‌تر و سریع‌تر)
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  // تبدیل به درجه چرخش
  const rotateX = useMotionTemplate`${mouseYSpring}deg`;
  const rotateY = useMotionTemplate`${mouseXSpring}deg`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // محاسبه درصد موقعیت موس (بین -0.5 تا 0.5)
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    // حداکثر چرخش ۸ درجه (برای حفظ ظرافت)
    x.set(xPct * 8);
    y.set(yPct * -8);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY, 
        transformStyle: "preserve-3d",
        transition: "transform 0.1s ease-out"
      }}
      className={className}
    >
      {/* translateZ باعث می‌شود محتوای داخلی کمی جلوتر از پس‌زمینه به نظر برسد (عمق واقعی) */}
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}