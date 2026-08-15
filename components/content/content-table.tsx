"use client";

import Link from "next/link";
import { MoreHorizontal, Eye, Trash2, ExternalLink } from "lucide-react";
import type { Timestamp } from "firebase/firestore";
import { getTopic } from "@/lib/topics";
import { getConcept } from "@/lib/concepts";
import { statusMeta, cleanTitle } from "@/lib/constants";
import type { ContentDoc } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function formatDate(ts?: Timestamp): string {
  if (!ts?.toDate) return "—";
  return ts.toDate().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function RowActions({
  content,
  onDelete,
}: {
  content: ContentDoc;
  onDelete: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="size-8" />}
      >
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Thao tác</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/create/${content.id}`} />}>
          <Eye className="size-4" />
          Xem &amp; sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(content.id)}
        >
          <Trash2 className="size-4" />
          Xoá
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------ Table view ------------------------------ */
export function ContentTable({
  contents,
  onDelete,
}: {
  contents: ContentDoc[];
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden shadow-soft">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên Content</TableHead>
            <TableHead className="hidden md:table-cell">Concept</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="hidden lg:table-cell">Link</TableHead>
            <TableHead className="hidden sm:table-cell">Ngày tạo</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((c) => {
            const concept = getConcept(c.conceptId);
            const meta = statusMeta(c.status);
            return (
              <TableRow key={c.id} className="group">
                <TableCell className="max-w-[280px]">
                  <Link
                    href={`/create/${c.id}`}
                    className="line-clamp-1 font-medium hover:text-primary"
                  >
                    {cleanTitle(c.title)}
                  </Link>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {getTopic(c.topicId)?.name}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {c.kind === "script" ? (
                    <span className="text-sm text-muted-foreground">
                      🎬 Kịch bản
                    </span>
                  ) : concept ? (
                    <span className="text-sm text-muted-foreground">
                      {concept.emoji} {concept.name}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={meta.className}>
                    {meta.label}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {c.publicUrl ? (
                    <a
                      href={c.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      Mở <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {formatDate(c.createdAt)}
                </TableCell>
                <TableCell>
                  <RowActions content={c} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

/* ------------------------------ Card view ------------------------------ */
export function ContentGrid({
  contents,
  onDelete,
}: {
  contents: ContentDoc[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {contents.map((c) => {
        const concept = getConcept(c.conceptId);
        const topic = getTopic(c.topicId);
        const meta = statusMeta(c.status);
        return (
          <Card
            key={c.id}
            className="group flex flex-col shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
          >
            <CardContent className="flex flex-1 flex-col gap-3 pt-6">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className={meta.className}>
                  {meta.label}
                </Badge>
                <RowActions content={c} onDelete={onDelete} />
              </div>
              <Link href={`/create/${c.id}`} className="flex-1">
                <h3 className="line-clamp-2 font-semibold leading-snug hover:text-primary">
                  {cleanTitle(c.title)}
                </h3>
                <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">
                  {c.rawInput}
                </p>
              </Link>
              <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>
                  {topic?.emoji} {concept?.name}
                </span>
                <span>{formatDate(c.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
