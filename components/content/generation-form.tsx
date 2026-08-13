"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  Copy,
  Save,
  Download,
  Square,
  Wand2,
  Plus,
  X,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createContent } from "@/hooks/use-contents";
import { Markdown } from "./markdown-preview";
import { CONCEPTS, conceptsByGroup } from "@/lib/concepts";
import { TOPICS } from "@/lib/topics";
import {
  TONE_OPTIONS,
  LENGTH_OPTIONS,
  DEFAULT_CONTENT_MODEL,
  deriveTitle,
  countWords,
  splitContentSections,
  parseHooks,
  toCleanMarkdown,
} from "@/lib/constants";
import type { ContentLength, ContentTone } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const conceptItems = CONCEPTS.map((c) => ({
  value: c.id,
  label: `${c.emoji} ${c.name}`,
}));

const topicItems = TOPICS.map((t) => ({
  value: t.id,
  label: `${t.emoji} ${t.name}`,
}));

/** Small section wrapper: number badge + label + optional hint. */
function Field({
  step,
  label,
  hint,
  children,
}: {
  step: number;
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[0.7rem] font-semibold text-primary">
          {step}
        </span>
        <span className="text-sm font-semibold">{label}</span>
        {hint && <span className="ml-auto text-xs">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/** Section header for the preview (colored bar + emoji + label). */
function SectionLabel({
  emoji,
  text,
  accent,
}: {
  emoji: string;
  text: string;
  accent: "indigo" | "slate" | "violet";
}) {
  const bar =
    accent === "indigo"
      ? "bg-indigo-500"
      : accent === "violet"
        ? "bg-violet-500"
        : "bg-slate-400";
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className={`h-4 w-1 rounded-full ${bar}`} />
      <span className="text-sm font-semibold">
        {emoji} {text}
      </span>
    </div>
  );
}

export function GenerationForm() {
  const router = useRouter();
  const { user, getToken } = useAuth();

  const [rawInput, setRawInput] = useState("");
  const personaId = ""; // Persona đã bỏ; thay bằng Tuyến nội dung bên dưới.
  const [topicId, setTopicId] = useState(TOPICS[0].id);
  const [conceptId, setConceptId] = useState(CONCEPTS[0].id);
  const [formula, setFormula] = useState("");
  const [showFormula, setShowFormula] = useState(false);
  const [tone, setTone] = useState<ContentTone>("friendly");
  const [length, setLength] = useState<ContentLength>("medium");

  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Nhận concept chọn sẵn từ trang "Concept viral".
  useEffect(() => {
    const pre = sessionStorage.getItem("create:concept");
    if (pre) {
      setConceptId(pre);
      sessionStorage.removeItem("create:concept");
    }
  }, []);

  async function handleGenerate() {
    if (!rawInput.trim()) {
      toast.error("Hãy nhập ý tưởng hoặc chủ đề trước.");
      return;
    }
    const token = await getToken();
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setOutput("");
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rawInput,
          personaId,
          topicId,
          conceptId,
          formula,
          tone,
          length,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Lỗi máy chủ (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOutput(acc);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error((err as Error).message || "Không thể tạo nội dung.");
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(toCleanMarkdown(output));
    toast.success("Đã sao chép nội dung.");
  }

  function handleExport() {
    const title = deriveTitle(splitContentSections(output).body, rawInput);
    download(
      `${title.replace(/[^\p{L}\p{N}\s-]/gu, "").trim() || "content"}.md`,
      toCleanMarkdown(output)
    );
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const title = deriveTitle(splitContentSections(output).body, rawInput);
      const id = await createContent({
        ownerId: user.uid,
        title,
        rawInput,
        body: toCleanMarkdown(output),
        personaId,
        topicId,
        conceptId,
        formula,
        tone,
        length,
        status: "idea",
        publicUrl: null,
        wordCount: countWords(output),
        model: DEFAULT_CONTENT_MODEL,
      });
      toast.success("Đã lưu vào danh sách.");
      router.push(`/create/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Không thể lưu nội dung.");
    } finally {
      setSaving(false);
    }
  }

  const hasOutput = output.trim().length > 0;
  const sections = splitContentSections(output);
  const hookList = parseHooks(sections.hooks);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
      {/* ---------------- Left: input ---------------- */}
      <Card className="border-border/70 shadow-soft">
        <CardContent className="space-y-7 pt-6">
          <Field step={1} label="Ý tưởng / chủ đề">
            <Textarea
              rows={3}
              placeholder="Ví dụ: Câu chuyện về món Phở Hà Nội..."
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="resize-none"
            />
          </Field>

          <Field step={2} label="Tuyến nội dung (lĩnh vực)">
            <Select
              items={topicItems}
              value={topicId}
              onValueChange={(v) => v && setTopicId(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {TOPICS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.emoji} {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            step={3}
            label="Concept kể chuyện"
            hint={
              <Link
                href="/concepts"
                className="inline-flex items-center gap-0.5 text-primary hover:underline"
              >
                Thư viện <ArrowUpRight className="size-3" />
              </Link>
            }
          >
            <Select
              items={conceptItems}
              value={conceptId}
              onValueChange={(v) => v && setConceptId(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {conceptsByGroup().map((g) => (
                  <SelectGroup key={g.id}>
                    <SelectLabel>{g.label}</SelectLabel>
                    {g.items.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.emoji} {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>

            {showFormula ? (
              <div className="mt-2 space-y-2 rounded-lg border border-dashed border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Công thức riêng (ưu tiên hơn concept)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowFormula(false);
                      setFormula("");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <Textarea
                  rows={3}
                  placeholder="Dán công thức / khung kể chuyện của bạn dưới dạng prompt…"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="resize-none text-sm"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowFormula(true)}
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="size-3.5" /> Dùng công thức kể chuyện riêng
              </button>
            )}
          </Field>

          <Field step={4} label="Tông giọng & độ dài">
            <div className="grid grid-cols-2 gap-3">
              <Select
                items={TONE_OPTIONS}
                value={tone}
                onValueChange={(v) => setTone(v as ContentTone)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                items={LENGTH_OPTIONS}
                value={length}
                onValueChange={(v) => setLength(v as ContentLength)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTH_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Field>

          {isStreaming ? (
            <Button onClick={() => abortRef.current?.abort()} variant="outline" className="w-full">
              <Square className="size-4" />
              Dừng tạo
            </Button>
          ) : (
            <Button onClick={handleGenerate} size="lg" className="w-full">
              <Wand2 className="size-4" />
              Tạo nội dung
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ---------------- Right: preview (sticky) ---------------- */}
      <Card className="border-border/70 shadow-soft lg:sticky lg:top-20">
        <CardContent className="flex h-full min-h-[460px] flex-col pt-6">
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-border pb-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" />
              Bản xem trước
              {isStreaming && (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              )}
              {hasOutput && sections.body && (
                <span className="font-normal text-muted-foreground">
                  · {countWords(sections.body)} từ
                </span>
              )}
            </div>

            {hasOutput && (
              <div className="flex gap-1">
                <Button
                  onClick={handleSave}
                  disabled={saving || isStreaming}
                  size="sm"
                >
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Lưu
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={isStreaming}
                  title="Sao chép"
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  onClick={handleExport}
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  disabled={isStreaming}
                  title="Xuất .md"
                >
                  <Download className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {hasOutput ? (
            <div className="max-h-[64vh] space-y-6 overflow-y-auto pr-1">
              {/* HOOKS */}
              {hookList.length > 0 && (
                <section>
                  <SectionLabel emoji="🎣" text="5 Hook gợi ý" accent="indigo" />
                  <div className="space-y-2">
                    {hookList.map((h, i) => (
                      <div
                        key={i}
                        className="group flex items-start gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 transition-colors hover:border-indigo-200"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[0.7rem] font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        <p className="flex-1 text-sm font-medium leading-6 text-foreground">
                          {h}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            navigator.clipboard
                              .writeText(h)
                              .then(() => toast.success("Đã chép hook."))
                          }
                          className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-white hover:text-primary group-hover:opacity-100"
                          title="Chép hook"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* THÂN BÀI */}
              {sections.body && (
                <section>
                  <SectionLabel emoji="📄" text="Thân bài" accent="slate" />
                  <Markdown content={sections.body} />
                </section>
              )}

              {/* KẾT */}
              {sections.ket && (
                <section>
                  <SectionLabel emoji="🏁" text="Kết & CTA" accent="violet" />
                  <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                    <Markdown content={sections.ket} />
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent">
                <Sparkles className="size-6 text-primary" />
              </div>
              <p className="max-w-xs text-sm">
                Nhập ý tưởng, chọn Tuyến nội dung &amp; Concept rồi bấm{" "}
                <span className="font-medium text-foreground">Tạo nội dung</span>
                . AI sẽ trả về{" "}
                <span className="font-medium text-foreground">
                  5 hook + thân bài + kết
                </span>{" "}
                ngay tại đây.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
