import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh w-full lg:grid-cols-2">
      {/* Brand / illustration side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-2 text-white">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles className="size-5" />
          </div>
          <span className="text-lg font-semibold">Content Support</span>
        </div>

        <div className="space-y-4 text-white">
          <h1 className="text-3xl font-bold leading-tight">
            Tạo nội dung AI
            <br />
            trong vài phút.
          </h1>
          <p className="max-w-md text-white/80">
            Viết bài chuẩn phong cách với Persona &amp; công thức kể chuyện của
            riêng bạn, rồi quản lý mọi thứ ở một nơi.
          </p>
        </div>

        {/* Decorative glow */}
        <div className="animate-float pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="animate-float-slow pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="animate-float pointer-events-none absolute right-1/3 top-1/2 size-40 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <FadeIn className="w-full max-w-sm">{children}</FadeIn>
      </div>
    </div>
  );
}
