"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Plus, KanbanSquare } from "lucide-react";
import {
  useContents,
  updateContent,
  deleteContent,
  createContent,
} from "@/hooks/use-contents";
import { useAuth } from "@/context/AuthContext";
import { ContentBoard } from "@/components/content/content-board";
import { PageHeader } from "@/components/layout/page-header";
import { CONCEPTS } from "@/lib/concepts";
import {
  statusMeta,
  DEFAULT_CONTENT_MODEL,
  countWords,
  cleanTitle,
} from "@/lib/constants";
import type { ContentStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BoardPage() {
  const { contents, loading } = useContents();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [concept, setConcept] = useState<string>("all");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Tạo content thủ công (nhập tay kịch bản + caption + hashtag).
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [saving, setSaving] = useState(false);

  function resetCreateForm() {
    setTitle("");
    setScript("");
    setCaption("");
    setHashtag("");
  }

  async function handleCreate() {
    if (!user) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }
    if (!script.trim()) {
      toast.error("Hãy nhập nội dung kịch bản.");
      return;
    }
    const parts = [script.trim()];
    if (caption.trim()) parts.push(`**📝 Caption:** ${caption.trim()}`);
    if (hashtag.trim()) parts.push(`**#️⃣ Hashtag:** ${hashtag.trim()}`);
    const body = parts.join("\n\n");

    setSaving(true);
    try {
      await createContent({
        ownerId: user.uid,
        kind: "script",
        title: cleanTitle(title) || "Kịch bản",
        rawInput: caption.trim() || script.trim().slice(0, 200),
        body,
        personaId: "",
        conceptId: "",
        formula: "",
        tone: "friendly",
        length: "short",
        status: "idea",
        publicUrl: null,
        wordCount: countWords(body),
        model: DEFAULT_CONTENT_MODEL,
      });
      toast.success("Đã thêm vào Quản lý nội dung.");
      resetCreateForm();
      setCreateOpen(false);
    } catch {
      toast.error("Không thể lưu nội dung.");
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contents.filter((c) => {
      if (concept !== "all" && c.conceptId !== concept) return false;
      if (
        q &&
        !c.title.toLowerCase().includes(q) &&
        !c.rawInput.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [contents, search, concept]);

  async function handleMove(id: string, status: ContentStatus) {
    try {
      await updateContent(id, { status });
      toast.success(`Đã chuyển sang "${statusMeta(status).label}".`);
    } catch {
      toast.error("Không thể cập nhật trạng thái.");
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteContent(pendingDelete);
      toast.success("Đã xoá nội dung.");
    } catch {
      toast.error("Không thể xoá.");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={KanbanSquare}
        title="Quản lý Content"
        subtitle="Kéo-thả thẻ giữa các cột để đổi trạng thái công việc."
      >
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Tạo Content
        </Button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tiêu đề hoặc ý tưởng…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          items={[
            { value: "all", label: "Mọi concept" },
            ...CONCEPTS.map((c) => ({
              value: c.id,
              label: `${c.emoji} ${c.name}`,
            })),
          ]}
          value={concept}
          onValueChange={(v) => setConcept(v ?? "all")}
        >
          <SelectTrigger className="w-full sm:w-[190px]">
            <SelectValue placeholder="Concept" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi concept</SelectItem>
            {CONCEPTS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Board */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : contents.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-accent">
              <KanbanSquare className="size-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Bạn chưa tạo nội dung nào.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Tạo nội dung đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ContentBoard
          contents={filtered}
          onMove={handleMove}
          onDelete={setPendingDelete}
        />
      )}

      {/* Delete confirm */}
      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xoá nội dung?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Huỷ
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xoá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tạo content thủ công */}
      <Dialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) resetCreateForm();
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tạo content mới</DialogTitle>
            <DialogDescription>
              Nhập kịch bản, caption và hashtag để lưu vào Quản lý nội dung.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="c-title">Tiêu đề</Label>
              <Input
                id="c-title"
                placeholder="Ví dụ: Bầu ăn được mì cay không?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-script">Kịch bản *</Label>
              <Textarea
                id="c-script"
                rows={8}
                placeholder="Dán hoặc gõ nội dung kịch bản video (mỗi câu một dòng)…"
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-caption">Caption</Label>
              <Textarea
                id="c-caption"
                rows={3}
                placeholder="Caption đăng TikTok/Reels…"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c-hashtag">Hashtag</Label>
              <Input
                id="c-hashtag"
                placeholder="#cuongtaplamchong #chongchamvobau #mebau …"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={saving}
            >
              Huỷ
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu vào board"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
