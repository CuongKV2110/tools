"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Search,
  Plus,
  FileText,
  CheckCircle2,
  PencilLine,
  Lightbulb,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import { useContents, deleteContent } from "@/hooks/use-contents";
import { ContentTable, ContentGrid } from "@/components/content/content-table";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { CONCEPTS } from "@/lib/concepts";
import { STATUS_OPTIONS } from "@/lib/constants";
import type { ContentStatus } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
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

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
  index = 0,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card className="shadow-soft">
        <CardContent className="flex items-center gap-4 py-5">
        <div
          className={`flex size-11 items-center justify-center rounded-xl ${tint}`}
        >
          <Icon className="size-5" />
        </div>
          <div>
            <p className="text-2xl font-bold leading-none">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { contents, loading } = useContents();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ContentStatus | "all">("all");
  const [concept, setConcept] = useState<string>("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: contents.length,
      done: contents.filter((c) => c.status === "done").length,
      progress: contents.filter((c) => c.status === "progress").length,
      idea: contents.filter((c) => c.status === "idea").length,
    }),
    [contents]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contents.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (concept !== "all" && c.conceptId !== concept) return false;
      if (
        q &&
        !c.title.toLowerCase().includes(q) &&
        !c.rawInput.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [contents, search, status, concept]);

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
      {/* Hero banner + slider */}
      <WelcomeBanner />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Tổng Content"
          value={stats.total}
          icon={FileText}
          tint="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          index={1}
          label="Hoàn thành"
          value={stats.done}
          icon={CheckCircle2}
          tint="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          index={2}
          label="Đang làm"
          value={stats.progress}
          icon={PencilLine}
          tint="bg-blue-50 text-blue-600"
        />
        <StatCard
          index={3}
          label="Ý tưởng"
          value={stats.idea}
          icon={Lightbulb}
          tint="bg-violet-50 text-violet-600"
        />
      </div>

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
            { value: "all", label: "Mọi trạng thái" },
            ...STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
          ]}
          value={status}
          onValueChange={(v) => setStatus((v ?? "all") as typeof status)}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi trạng thái</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
          <SelectTrigger className="w-full sm:w-[170px]">
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

        <div className="flex items-center rounded-lg border border-border p-0.5">
          <Button
            size="icon"
            variant={view === "table" ? "secondary" : "ghost"}
            className="size-8"
            onClick={() => setView("table")}
          >
            <TableIcon className="size-4" />
          </Button>
          <Button
            size="icon"
            variant={view === "grid" ? "secondary" : "ghost"}
            className="size-8"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-accent">
              <FileText className="size-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              {contents.length === 0
                ? "Bạn chưa tạo nội dung nào."
                : "Không có nội dung phù hợp bộ lọc."}
            </p>
            {contents.length === 0 && (
              <Link href="/create" className={cn(buttonVariants())}>
                <Plus className="size-4" />
                Tạo nội dung đầu tiên
              </Link>
            )}
          </CardContent>
        </Card>
      ) : view === "table" ? (
        <ContentTable contents={filtered} onDelete={setPendingDelete} />
      ) : (
        <ContentGrid contents={filtered} onDelete={setPendingDelete} />
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
