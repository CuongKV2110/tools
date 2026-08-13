"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getConcept } from "@/lib/concepts";
import { getTopic } from "@/lib/topics";
import { STATUS_OPTIONS, cleanTitle } from "@/lib/constants";
import { formatDate } from "@/components/content/content-table";
import type { ContentDoc, ContentStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Kanban board: one column per {@link ContentStatus}. Cards are dragged
 * between columns; dropping updates the content's status via `onMove`.
 * Uses the native HTML5 drag-and-drop API — no extra dependency.
 */
export function ContentBoard({
  contents,
  onMove,
  onDelete,
}: {
  contents: ContentDoc[];
  onMove: (id: string, status: ContentStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<ContentStatus | null>(null);

  function handleDrop(status: ContentStatus) {
    if (dragId) {
      const current = contents.find((c) => c.id === dragId);
      if (current && current.status !== status) onMove(dragId, status);
    }
    setDragId(null);
    setOverCol(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATUS_OPTIONS.map((col) => {
        const items = contents.filter((c) => c.status === col.value);
        return (
          <div
            key={col.value}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(col.value);
            }}
            onDragLeave={() => setOverCol((v) => (v === col.value ? null : v))}
            onDrop={() => handleDrop(col.value)}
            className={cn(
              "flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-3 transition-colors",
              overCol === col.value && "border-primary/50 bg-accent"
            )}
          >
            <div className="flex items-center justify-between px-1">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                  col.className
                )}
              >
                {col.label}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>

            <div className="flex min-h-24 flex-col gap-2">
              {items.map((c) => {
                const concept = getConcept(c.conceptId);
                const topic = getTopic(c.topicId);
                return (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => setDragId(c.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    className={cn(
                      "group cursor-grab rounded-lg border border-border bg-card p-3 shadow-soft transition-all active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-soft-lg",
                      dragId === c.id && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/create/${c.id}`}
                        className="line-clamp-2 flex-1 text-sm font-medium leading-snug hover:text-primary"
                      >
                        {cleanTitle(c.title)}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => onDelete(c.id)}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                        <span className="sr-only">Xoá</span>
                      </Button>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {c.rawInput}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="line-clamp-1">
                        {topic?.emoji} {concept?.name}
                      </span>
                      <span className="shrink-0">{formatDate(c.createdAt)}</span>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  Kéo thẻ vào đây
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
