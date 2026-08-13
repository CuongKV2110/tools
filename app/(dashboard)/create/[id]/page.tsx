"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  Download,
  Loader2,
  Pencil,
  Save,
  Trash2,
  Eye,
} from "lucide-react";
import {
  useContent,
  updateContent,
  deleteContent,
} from "@/hooks/use-contents";
import { Markdown } from "@/components/content/markdown-preview";
import { getTopic } from "@/lib/topics";
import { getConcept } from "@/lib/concepts";
import {
  STATUS_OPTIONS,
  statusMeta,
  countWords,
  cleanTitle,
} from "@/lib/constants";
import type { ContentStatus } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { content, loading } = useContent(params.id);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<ContentStatus>("idea");
  const [saving, setSaving] = useState(false);

  // Sync local edit state whenever the doc loads/changes (and not mid-edit).
  useEffect(() => {
    if (content && !editing) {
      setTitle(cleanTitle(content.title));
      setBody(content.body);
      setStatus(content.status);
    }
  }, [content, editing]);

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    try {
      await updateContent(content.id, {
        title,
        body,
        status,
        wordCount: countWords(body),
      });
      toast.success("Đã lưu thay đổi.");
      setEditing(false);
    } catch {
      toast.error("Không thể lưu thay đổi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(next: ContentStatus) {
    setStatus(next);
    if (content && !editing) {
      await updateContent(content.id, { status: next });
      toast.success("Đã cập nhật trạng thái.");
    }
  }

  async function handleDelete() {
    if (!content) return;
    await deleteContent(content.id);
    toast.success("Đã xoá nội dung.");
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center">
        <p className="text-muted-foreground">Không tìm thấy nội dung này.</p>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
        >
          Về Dashboard
        </Link>
      </div>
    );
  }

  const topic = getTopic(content.topicId);
  const concept = getConcept(content.conceptId);
  const meta = statusMeta(status);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ArrowLeft className="size-4" />
          Danh sách
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
            value={status}
            onValueChange={(v) => handleStatusChange(v as ContentStatus)}
          >
            <SelectTrigger size="sm" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {editing ? (
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Lưu
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil className="size-4" />
              Sửa
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(content.body).then(() => toast.success("Đã sao chép."))}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => download(`${content.title || "content"}.md`, content.body)}
          >
            <Download className="size-4" />
          </Button>

          <Dialog>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                />
              }
            >
              <Trash2 className="size-4" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xoá nội dung?</DialogTitle>
                <DialogDescription>
                  Hành động này không thể hoàn tác. Nội dung sẽ bị xoá vĩnh viễn.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Huỷ
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  Xoá
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={meta.className}>
          {meta.label}
        </Badge>
        {topic && (
          <Badge variant="secondary">
            {topic.emoji} {topic.name}
          </Badge>
        )}
        {concept && (
          <Badge variant="secondary">
            {concept.emoji} {concept.name}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {countWords(editing ? body : content.body)} từ
        </span>
      </div>

      <Card className="shadow-soft">
        <CardContent className="space-y-4 pt-6">
          {editing ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tiêu đề</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nội dung (Markdown)
                </label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="size-3.5" /> Bấm “Lưu” để xem lại bản Markdown đã
                render.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">
                {cleanTitle(content.title)}
              </h1>
              <div className="h-px bg-border" />
              <Markdown content={content.body} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
