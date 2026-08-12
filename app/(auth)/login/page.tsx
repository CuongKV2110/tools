"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authErrorMessage } from "@/lib/firebase-errors";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInEmail, signInGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <span className="text-lg font-semibold">Content Support</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground">
          Chào mừng trở lại! Nhập thông tin để tiếp tục.
        </p>
      </div>

      <GoogleButton onClick={handleGoogle} loading={googleBusy} />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">hoặc</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="ban@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          Đăng nhập
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
