"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, LogOut, Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/motion";
import { updateProfile } from "firebase/auth";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [name, setName] = useState(
    profile?.displayName ?? user?.displayName ?? ""
  );
  const [saving, setSaving] = useState(false);

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
    <FadeIn className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Cài đặt"
        subtitle="Quản lý hồ sơ và tài khoản của bạn."
      />

      <Card className="shadow-soft">
        <CardContent className="space-y-5 pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage
                src={profile?.photoURL ?? user?.photoURL ?? undefined}
                alt={name}
              />
              <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
                {name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{name || "Người dùng"}</p>
              <Badge variant="secondary" className="mt-1 uppercase">
                {profile?.plan ?? "free"}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ""} disabled />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 shadow-soft">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-sm font-medium">Đăng xuất</p>
            <p className="text-xs text-muted-foreground">
              Kết thúc phiên làm việc trên thiết bị này.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="size-4" />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
