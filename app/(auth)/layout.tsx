import Image from "next/image";
import { Flame, Fingerprint, Clapperboard } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

const HIGHLIGHTS = [
  { icon: Flame, text: "Concept viral đang bùng nổ" },
  { icon: Fingerprint, text: "Phân tích chân dung khách hàng" },
  { icon: Clapperboard, text: "Kịch bản video HILLA 60–90s" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-[1.05fr_1fr]">
      {/* Brand / illustration side */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Animated gradient background */}
        <div className="animate-gradient absolute inset-0 -z-20 bg-[linear-gradient(130deg,#4f46e5_0%,#7c3aed_40%,#6d28d9_70%,#0ea5e9_100%)]" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
          }}
        />
        {/* Glowing orbs */}
        <div className="animate-glow pointer-events-none absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-white/20 blur-3xl" />
        <div className="animate-glow pointer-events-none absolute -bottom-32 -left-16 -z-10 size-80 rounded-full bg-cyan-300/20 blur-3xl [animation-delay:2s]" />

        {/* Brand */}
        <FadeIn className="flex items-center gap-2 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png?v=2"
            alt="Content Support"
            className="size-10 rounded-xl bg-white/15 object-contain p-1 backdrop-blur"
          />
          <span className="text-lg font-semibold">Content Support</span>
        </FadeIn>

        {/* Hero image + copy */}
        <FadeIn className="space-y-7 text-white">
          <div className="group relative w-full max-w-xl">
            {/* soft halo behind the image */}
            <div className="absolute -inset-3 -z-10 rounded-[28px] bg-white/10 blur-xl" />
            <div className="overflow-hidden rounded-3xl shadow-soft-lg ring-1 ring-white/25">
              <Image
                src="/login-hero.png"
                alt="Viral Content Ideas"
                width={1200}
                height={628}
                priority
                className="h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {/* sheen sweep on hover */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="animate-sheen absolute inset-y-0 -left-1/2 w-1/3 bg-white/20 blur-md" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Tạo nội dung
              <br />
              <span className="text-cyan-200">bùng nổ view</span> trong vài phút.
            </h1>
            <p className="max-w-md text-white/80">
              Viết nội dung đúng phong cách và công thức kể chuyện của riêng
              bạn, rồi quản lý mọi thứ ở một nơi.
            </p>
          </div>

          {/* Feature highlights */}
          <ul className="flex flex-wrap gap-2.5">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur"
              >
                <Icon className="size-4 text-cyan-200" />
                {text}
              </li>
            ))}
          </ul>
        </FadeIn>

        {/* Footer note */}
        <FadeIn className="text-xs text-white/60">
          © {" "}Content Support — Trợ lý nội dung AI của bạn.
        </FadeIn>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center bg-background p-6 sm:p-10">
        {/* faint brand accent on mobile / top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-accent/60 to-transparent lg:hidden" />
        <FadeIn className="w-full max-w-md">{children}</FadeIn>
      </div>
    </div>
  );
}
