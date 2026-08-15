"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/firebase-errors";
import { validateEmail, validateLoginPassword } from "@/lib/validation";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1 text-xs font-medium text-destructive">
      <AlertCircle className="size-3.5" />
      {message}
    </p>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInEmail, signInGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = validateEmail(email);
  const pwError = validateLoginPassword(password);
  const formValid = !emailError && !pwError;

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!formValid) return;
    setBusy(true);
    try {
      await signInEmail(email, password);
      toast.success("Đăng nhập thành công");
      router.replace("/dashboard");
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setGoogleBusy(true);
    try {
      await signInGoogle();
      router.replace("/dashboard");
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <div className="flex items-center gap-2 lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png?v=2"
            alt="Content Support"
            className="size-9 rounded-xl object-contain"
          />
          <span className="text-lg font-semibold">Content Support</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Đăng nhập
        </h1>
        <p className="text-[0.95rem] text-muted-foreground">
          Chào mừng trở lại! Nhập thông tin để tiếp tục.
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} loading={googleBusy} />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          hoặc
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ban@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={touched.email && !!emailError}
              className={cn(
                "h-12 pl-10 text-base",
                touched.email &&
                  emailError &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
              )}
            />
          </div>
          {touched.email && emailError && <FieldError message={emailError} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={touched.password && !!pwError}
              className={cn(
                "h-12 pl-10 pr-10 text-base",
                touched.password &&
                  pwError &&
                  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {touched.password && pwError && <FieldError message={pwError} />}
        </div>

        <Button
          type="submit"
          disabled={busy || !formValid}
          className="h-12 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] text-base font-semibold shadow-soft-lg transition-all hover:bg-right hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Đăng nhập
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
