"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Loader2,
  LogOut,
  User as UserIcon,
  Mail,
  Crown,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [name, setName] = useState(
    profile?.displayName ?? user?.displayName ?? ""
  );
  const [saving, setSaving] = useState(false);

  const email = user?.email ?? "";
  const plan = profile?.plan ?? "free";
  const isPro = plan === "pro";
  const photo = profile?.photoURL ?? user?.photoURL ?? undefined;
  const provider = profile?.provider === "google" ? "Google" : "Email";

  async function handleSave() {
    if (!user || !auth.currentUser) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      await updateDoc(doc(db, "users", user.uid), {
        displayName: name,
        updatedAt: serverTimestamp(),
      });
      toast.success("Đã cập nhật hồ sơ.");
    } catch {
      toast.error("Không thể cập nhật.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    router.replace("/login");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hero profile */}
      <motion.div
        {...fade}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-soft-lg sm:p-7"
      >
        <div className="animate-gradient absolute inset-0 -z-10 bg-[linear-gradient(120deg,#4f46e5_0%,#7c3aed_50%,#0ea5e9_100%)]" />
        <div className="animate-glow absolute -right-12 -top-16 -z-10 size-48 rounded-full bg-white/20 blur-3xl" />

        <div className="flex items-center gap-4 sm:gap-5">
          <Avatar className="size-20 ring-4 ring-white/30">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className="bg-white/20 text-2xl font-semibold text-white">
              {name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-bold">
              {name || "Người dùng"}
            </h2>
            <p className="truncate text-sm text-white/80">{email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isPro
                    ? "bg-amber-300 text-amber-900"
                    : "bg-white/15 text-white ring-1 ring-white/25"
                }`}
              >
                {isPro ? (
                  <Crown className="size-3.5" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                Gói {isPro ? "PRO" : "FREE"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium ring-1 ring-white/25">
                <BadgeCheck className="size-3.5" />
                Đăng nhập bằng {provider}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.div
        {...fade}
        transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="shadow-soft">
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Thông tin cá nhân</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="h-11 pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email đăng nhập không thể thay đổi.
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-11 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] font-semibold shadow-soft transition-all hover:bg-right active:scale-[0.99]"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade hint (free users) */}
      {!isPro && (
        <motion.div
          {...fade}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="overflow-hidden border-amber-200 shadow-soft">
            <CardContent className="flex items-center justify-between gap-4 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Crown className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Nâng cấp lên PRO</p>
                  <p className="text-xs text-muted-foreground">
                    Mở khoá toàn bộ tính năng và không giới hạn.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => toast.info("Tính năng nâng cấp sắp ra mắt 🚀")}
              >
                Nâng cấp
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Account / logout */}
      <motion.div
        {...fade}
        transition={{ duration: 0.45, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-destructive/20 shadow-soft">
          <CardContent className="flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Đăng xuất</p>
                <p className="text-xs text-muted-foreground">
                  Kết thúc phiên làm việc trên thiết bị này.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
