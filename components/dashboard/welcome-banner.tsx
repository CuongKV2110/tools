"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Sparkles,
  Flame,
  Clapperboard,
  Fingerprint,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Slide =
  | { type: "image"; src: string; href?: string; alt: string }
  | {
      type: "feature";
      icon: typeof Flame;
      title: string;
      desc: string;
      href: string;
      cta: string;
    };

/** Rotating slides shown in the banner: image banners + feature highlights. */
const SLIDES: Slide[] = [
  { type: "image", src: "/banner1.png", href: "/create", alt: "Banner 1" },
  { type: "image", src: "/banner3.jpg", href: "/concepts", alt: "Banner 3" },
  { type: "image", src: "/banner4.jpg", href: "/material", alt: "Banner 4" },
  {
    type: "feature",
    icon: Flame,
    title: "Concept viral có sẵn",
    desc: "Chọn công thức kể chuyện đang bùng nổ, chỉ việc điền ý tưởng.",
    href: "/concepts",
    cta: "Khám phá concept",
  },
  {
    type: "feature",
    icon: Fingerprint,
    title: "Chất liệu bản thân",
    desc: "Phân tích chân dung khách hàng để nội dung chạm đúng nỗi đau.",
    href: "/material",
    cta: "Phân tích ngay",
  },
  {
    type: "feature",
    icon: Clapperboard,
    title: "Kịch bản video HILLA",
    desc: "Biến insight thành kịch bản Reels/TikTok đọc thẳng trước camera.",
    href: "/script",
    cta: "Viết kịch bản",
  },
];

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
        <div className="group/slider w-full lg:w-[440px]">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-white/10 shadow-soft-lg ring-1 ring-white/25 backdrop-blur-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                {slide.type === "image" ? (
                  <Link
                    href={slide.href ?? "#"}
                    className="group relative block h-full"
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="440px"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                    />
                    {/* subtle gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </Link>
                ) : (
                  <div className="flex h-full flex-col justify-center gap-3 bg-white/5 p-5">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-white/20">
                      <slide.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{slide.title}</p>
                      <p className="mt-1 text-sm text-white/80">{slide.desc}</p>
                      <Link
                        href={slide.href}
                        className="mt-3 inline-flex items-center gap-1 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/25"
                      >
                        {slide.cta}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next controls (appear on hover) */}
            <button
              aria-label="Trước"
              onClick={() =>
                setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
              }
              className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/50 group-hover/slider:opacity-100"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Sau"
              onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
              className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/50 group-hover/slider:opacity-100"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Slider dots */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
