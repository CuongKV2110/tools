"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  Flame,
  Clapperboard,
  Fingerprint,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/** Rotating highlights shown in the banner slider. */
const SLIDES = [
  {
    icon: Flame,
    title: "Concept viral có sẵn",
    desc: "Chọn công thức kể chuyện đang bùng nổ, chỉ việc điền ý tưởng.",
    href: "/concepts",
    cta: "Khám phá concept",
  },
  {
    icon: Fingerprint,
    title: "Chất liệu bản thân",
    desc: "Phân tích chân dung khách hàng để nội dung chạm đúng nỗi đau.",
    href: "/material",
    cta: "Phân tích ngay",
  },
  {
    icon: Clapperboard,
    title: "Kịch bản video HILLA",
    desc: "Biến insight thành kịch bản Reels/TikTok đọc thẳng trước camera.",
    href: "/script",
    cta: "Viết kịch bản",
  },
] as const;

function greeting(): string {
  // Static (build-safe) greeting — avoids Date usage at module scope.
  return "Chào mừng trở lại";
}

export function WelcomeBanner() {
  const { profile, user } = useAuth();
  const name = profile?.displayName || user?.displayName || "bạn";

  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const hello = useMemo(greeting, []);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const Icon = slide.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 text-white shadow-soft-lg sm:p-8"
    >
      {/* Animated gradient background */}
      <div className="animate-gradient absolute inset-0 -z-10 bg-[linear-gradient(120deg,#4f46e5_0%,#7c3aed_45%,#0ea5e9_100%)]" />
      {/* Decorative glowing orbs */}
      <div className="animate-glow absolute -right-10 -top-16 -z-10 size-52 rounded-full bg-white/20 blur-3xl" />
      <div className="animate-glow absolute -bottom-20 left-1/3 -z-10 size-56 rounded-full bg-cyan-300/20 blur-3xl [animation-delay:2s]" />
      {/* Sheen sweep */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-sheen absolute inset-y-0 -left-1/2 w-1/3 bg-white/10 blur-md" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Greeting */}
        <div className="max-w-md">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="size-3.5" />
            Content Support
          </div>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            {hello}, {name}! 👋
          </h2>
          <p className="mt-1.5 text-sm text-white/80">
            Hôm nay bạn muốn tạo nội dung gì? Bắt đầu chỉ trong vài phút.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Sparkles className="size-4" />
            Tạo Content ngay
          </Link>
        </div>

        {/* Slider */}
        <div className="w-full max-w-sm">
          <div className="relative min-h-[120px] rounded-xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{slide.title}</p>
                    <p className="mt-0.5 text-xs text-white/80">{slide.desc}</p>
                    <Link
                      href={slide.href}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white hover:underline"
                    >
                      {slide.cta}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider dots */}
          <div className="mt-3 flex items-center justify-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
