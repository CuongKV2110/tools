"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/firebase-errors";
import {
  validateName,
  validateEmail,
  validateNewPassword,
  passwordStrength,
} from "@/lib/validation";
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

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, signUpEmail, signInGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });

  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const pwError = validateNewPassword(password);
  const confirmError = !confirm
    ? "Vui lòng nhập lại mật khẩu."
    : confirm !== password
      ? "Mật khẩu nhập lại không khớp."
      : null;
  const formValid = !nameError && !emailError && !pwError && !confirmError;
  const strength = passwordStrength(password);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!formValid) return;
    setBusy(true);
    try {
      await signUpEmail(name, email, password);
      toast.success("Tạo tài khoản thành công");
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

  const invalidCls =
    "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30";

  return (
    <div className="space-y-6">
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
          Tạo tài khoản
        </h1>
        <p className="text-[0.95rem] text-muted-foreground">
          Bắt đầu miễn phí — không cần thẻ tín dụng.
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">Họ và tên</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              aria-invalid={touched.name && !!nameError}
              className={cn("h-12 pl-10 text-base", touched.name && nameError && invalidCls)}
            />
          </div>
          {touched.name && nameError && <FieldError message={nameError} />}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
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
              className={cn("h-12 pl-10 text-base", touched.email && emailError && invalidCls)}
            />
          </div>
          {touched.email && emailError && <FieldError message={emailError} />}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Tối thiểu 6 ký tự, có chữ và số"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={touched.password && !!pwError}
              className={cn(
                "h-12 pl-10 pr-10 text-base",
                touched.password && pwError && invalidCls
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

          {/* Strength meter */}
          {password && (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      i < strength.score ? strength.barClass : "bg-border"
                    )}
                  />
                ))}
              </div>
              <span className={cn("text-xs font-medium", strength.textClass)}>
                {strength.label}
              </span>
            </div>
          )}
          {touched.password && pwError && <FieldError message={pwError} />}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Nhập lại mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
              aria-invalid={touched.confirm && !!confirmError}
              className={cn(
                "h-12 pl-10 pr-10 text-base",
                touched.confirm && confirmError && invalidCls
              )}
            />
            {confirm && !confirmError && (
              <Check className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-emerald-500" />
            )}
          </div>
          {touched.confirm && confirmError && (
            <FieldError message={confirmError} />
          )}
        </div>

        <Button
          type="submit"
          disabled={busy || !formValid}
          className="h-12 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] text-base font-semibold shadow-soft-lg transition-all hover:bg-right hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Tạo tài khoản
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
