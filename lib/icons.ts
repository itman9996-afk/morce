import {
  Megaphone,
  Clapperboard,
  Sparkles,
  Workflow,
  Users,
  FileVideo,
  Target,
  UserPlus,
  PhoneCall,
  ShoppingBag,
  BarChart,
  TrendingUp,
  ShoppingCart,
  Stethoscope,
  HeartPulse,
  Utensils,
  Building,
  User,
  Key,
  GraduationCap,
  Factory,
  Grid,
  type LucideIcon,
} from "lucide-react";

import { type IconKey } from "@/data/content";

const iconMap: Record<IconKey, LucideIcon> = {
  megaphone: Megaphone,
  clapperboard: Clapperboard,
  sparkles: Sparkles,
  workflow: Workflow,
  users: Users,
  "file-video": FileVideo,
  target: Target,
  "user-plus": UserPlus,
  "phone-call": PhoneCall,
  "shopping-bag": ShoppingBag,
  "bar-chart": BarChart,
  "trending-up": TrendingUp,
  "shopping-cart": ShoppingCart,
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
  utensils: Utensils,
  building: Building,
  user: User,
  key: Key,
  graduation: GraduationCap,
  factory: Factory,
  grid: Grid,
};

export function getIcon(key: IconKey): LucideIcon {
  return iconMap[key] || Grid; // اگر آیکونی پیدا نشد، به صورت پیش‌فرض Grid را نشان می‌دهد
}