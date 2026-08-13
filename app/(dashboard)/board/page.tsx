"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Plus, KanbanSquare } from "lucide-react";
import { useContents, updateContent, deleteContent } from "@/hooks/use-contents";
import { ContentBoard } from "@/components/content/content-board";
import { PageHeader } from "@/components/layout/page-header";
import { CONCEPTS } from "@/lib/concepts";
import { statusMeta } from "@/lib/constants";
import type { ContentStatus } from "@/types";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
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

  const [search, setSearch] = useState("");
  const [concept, setConcept] = useState<string>("all");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

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
        <Link href="/create" className={cn(buttonVariants())}>
          <Plus className="size-4" />
          Tạo Content
        </Link>
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
            <Link href="/create" className={cn(buttonVariants())}>
              <Plus className="size-4" />
              Tạo nội dung đầu tiên
            </Link>
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
    </div>
  );
}
