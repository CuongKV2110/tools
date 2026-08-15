"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PenLine,
  Lightbulb,
  Layers,
  ListChecks,
  Quote,
  Sparkles,
  Type,
  PlusCircle,
} from "lucide-react";
import { conceptsByGroup, CONCEPT_GROUPS } from "@/lib/concepts";
import { getConceptDetail } from "@/lib/concept-details";
import { Markdown } from "@/components/content/markdown-preview";
import type { Concept } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function DetailSection({
  icon: Icon,
  title,
  highlight,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={
        highlight
          ? "rounded-xl border border-primary/20 bg-accent/50 p-4"
          : "rounded-xl border border-border bg-card p-4"
      }
    >
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </p>
      <div className="text-sm leading-6 text-foreground/90">{children}</div>
    </section>
  );
}

export function ConceptLibrary() {
  const router = useRouter();
  const groups = conceptsByGroup();
  const [selected, setSelected] = useState<Concept | null>(null);
  const detail = selected ? getConceptDetail(selected.id) : undefined;

  function useConcept(id: string) {
    sessionStorage.setItem("create:concept", id);
    router.push("/create");
  }

  return (
    <>
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{g.label}</h3>
              <Badge variant="secondary">{g.items.length}</Badge>
            </div>
            <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((c) => (
                <StaggerItem key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(c)}
                    className="flex h-full w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft-lg"
                  >
                    <span className="text-2xl leading-none">{c.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {c.name}
                      </span>
                      <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
                        {c.description}
                      </span>
                    </span>
                  </button>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <DialogContent className="max-h-[90vh] w-[94vw] overflow-y-auto p-0 sm:max-w-3xl">
          {selected && detail && (
            <>
              {/* Header có nền gradient */}
              <div className="rounded-t-[inherit] bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
                <DialogHeader className="space-y-2">
                  <Badge className="w-fit border-white/30 bg-white/15 text-white">
                    {CONCEPT_GROUPS.find((g) => g.id === selected.group)?.label}
                  </Badge>
                  <DialogTitle className="flex items-center gap-3 text-2xl text-white">
                    <span className="text-3xl">{selected.emoji}</span>
                    {selected.name}
                  </DialogTitle>
                  <DialogDescription className="text-white/85">
                    {selected.description}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-5 p-6 pt-5">
                {detail.principle && (
                  <DetailSection icon={Lightbulb} title="Nguyên tắc chung">
                    <Markdown content={detail.principle} />
                  </DetailSection>
                )}

                {detail.forms && (
                  <DetailSection icon={Layers} title="Những dạng triển khai">
                    <Markdown content={detail.forms} />
                  </DetailSection>
                )}

                {detail.format && (
                  <DetailSection icon={ListChecks} title="Cách triển khai">
                    <Markdown content={detail.format} />
                  </DetailSection>
                )}

                {detail.keywords && (
                  <DetailSection
                    icon={Sparkles}
                    title="Điểm hút view / keyword thành công"
                    highlight
                  >
                    <Markdown content={detail.keywords} />
                  </DetailSection>
                )}

                {detail.examples && (
                  <DetailSection
                    icon={Quote}
                    title="Ví dụ thực tế & nguồn tham khảo"
                  >
                    <Markdown content={detail.examples} />
                  </DetailSection>
                )}

                {detail.titles.length > 0 && (
                  <DetailSection icon={Type} title="Gợi ý tiêu đề">
                    <ul className="space-y-1.5">
                      {detail.titles.map((t, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <span className="font-semibold text-primary">
                            {i + 1}.
                          </span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailSection>
                )}

                {detail.application && (
                  <DetailSection icon={PlusCircle} title="Ứng dụng thêm">
                    <Markdown content={detail.application} />
                  </DetailSection>
                )}

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => useConcept(selected.id)}
                >
                  <PenLine className="size-4" />
                  Dùng concept này để tạo Content
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
