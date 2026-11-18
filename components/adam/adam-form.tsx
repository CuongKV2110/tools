"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Lightbulb,
  Loader2,
  Wand2,
  Square,
  Copy,
  Download,
  Plus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createContent } from "@/hooks/use-contents";
import { DEFAULT_CONTENT_MODEL, countWords, cleanTitle } from "@/lib/constants";
import { Markdown } from "@/components/content/markdown-preview";
import { CollapsibleSections } from "@/components/content/collapsible-sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Gợi ý từ cảm xúc — bấm để thêm nhanh vào ô. */
const EMOTION_SUGGESTIONS = [
  "U là chời",
  "Ây za",
  "Haizz",
  "Woaa",
  "Ui chời",
  "Huhh",
];

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdamForm() {
  const { user, getToken } = useAuth();

  const [desiredHook, setDesiredHook] = useState("");
  const [summary, setSummary] = useState("");
  const [emotionWords, setEmotionWords] = useState("");

  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  function addEmotion(word: string) {
    setEmotionWords((prev) => {
      const parts = prev
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.some((p) => p.toLowerCase() === word.toLowerCase())) return prev;
      return [...parts, word].join(", ");
    });
  }

  function selected(word: string) {
    return emotionWords
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .includes(word.toLowerCase());
  }

  async function handleSaveScript(title: string, body: string) {
    if (!user) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }
    const cleanName = cleanTitle(title) || "Kịch bản Adam";
    try {
      await createContent({
        ownerId: user.uid,
        kind: "script",
        title: cleanName,
        rawInput: summary || desiredHook.slice(0, 200),
        body: body.trim(),
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
      setSavedTitles((prev) => new Set(prev).add(title));
      toast.success(`Đã lưu "${cleanName}" vào Quản lý Content.`);
    } catch {
      toast.error("Không thể lưu kịch bản.");
    }
  }

  /**
   * Stream one step from /api/adam. `onChunk(accSoFar)` fires on each chunk so
   * the caller can update the combined view live. Returns the full text.
   */
  async function streamStep(
    token: string,
    payload: Record<string, unknown>,
    signal: AbortSignal,
    onChunk: (acc: string) => void
  ): Promise<string> {
    const res = await fetch("/api/adam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok || !res.body) {
      throw new Error((await res.text().catch(() => "")) || `Lỗi ${res.status}`);
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      acc += decoder.decode(value, { stream: true });
      onChunk(acc);
    }
    return acc;
  }

  async function handleGenerate() {
    if (!summary.trim() && !desiredHook.trim()) {
      toast.error("Hãy nhập câu hook hoặc mô tả nội dung.");
      return;
    }
    const token = await getToken();
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setStreaming(true);
    setResult("");
    setSavedTitles(new Set());
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // Bước 1: tạo 5 hook (nhanh).
      const hooks = await streamStep(
        token,
        { desiredHook, summary, emotionWords, mode: "hooks" },
        controller.signal,
        (acc) => setResult(acc)
      );
      if (!hooks.trim()) {
        toast.error(
          "Model AI đang quá tải, chưa trả về kết quả. Vui lòng thử lại sau vài giây."
        );
        return;
      }

      // Bước 2: viết 3 kịch bản, bám theo hook vừa tạo.
      const scripts = await streamStep(
        token,
        { desiredHook, summary, emotionWords, mode: "scripts", hooks },
        controller.signal,
        (acc) => setResult(`${hooks}\n\n${acc}`)
      );
      if (!scripts.trim()) {
        toast.error(
          "Đã có 5 hook nhưng chưa tạo được kịch bản. Vui lòng bấm Tạo content lại."
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error(
          (err as Error).message ||
            "Không thể tạo nội dung. Model có thể đang quá tải, hãy thử lại."
        );
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  const hasResult = result.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="shadow-soft">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="hook">Câu hook mong muốn</Label>
            <Input
              id="hook"
              placeholder="Dán 1 câu hook bạn đang phân vân — AI sẽ tham khảo và viết tốt hơn."
              value={desiredHook}
              onChange={(e) => setDesiredHook(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Mô tả sơ bộ nội dung *</Label>
            <Textarea
              id="summary"
              rows={5}
              placeholder={
                "Diễn biến câu chuyện, bạn muốn kịch bản đi theo hướng nào, cái kết ra sao… Nhập càng chi tiết AI càng bám sát.\nVí dụ: Cô vợ giận chồng vì quên kỷ niệm ngày cưới, nhưng cuối video chồng bất ngờ chuẩn bị điều đặc biệt; thông điệp: đàn ông vụng về nhưng vẫn yêu theo cách riêng."
              }
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotions">Các từ khóa cảm xúc muốn thêm vào</Label>
            <Input
              id="emotions"
              placeholder="Ví dụ: U là chời, Ây za, Haizz, Woaa…"
              value={emotionWords}
              onChange={(e) => setEmotionWords(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {EMOTION_SUGGESTIONS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => addEmotion(w)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    selected(w)
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Plus className="size-3" />
                  {w}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Bấm để thêm nhanh, hoặc tự gõ các từ cảm xúc, ngăn cách bằng dấu
              phẩy.
            </p>
          </div>

          {streaming ? (
            <Button
              onClick={() => abortRef.current?.abort()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Square className="size-4" />
              Dừng
            </Button>
          ) : (
            <Button onClick={handleGenerate} className="w-full sm:w-auto">
              <Wand2 className="size-4" />
              Tạo content
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Result */}
      {(hasResult || streaming) && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Lightbulb className="size-4 text-primary" />
                5 hook đề xuất &amp; 3 kịch bản
                {streaming && (
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                )}
              </div>
              {hasResult && !streaming && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigator.clipboard
                        .writeText(result)
                        .then(() => toast.success("Đã sao chép."))
                    }
                  >
                    <Copy className="size-4" />
                    Sao chép
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => download("kich-ban-adam.md", result)}
                  >
                    <Download className="size-4" />
                    Xuất .md
                  </Button>
                </div>
              )}
            </div>

            {streaming ? (
              <Markdown content={result} />
            ) : (
              <CollapsibleSections
                content={result}
                collapsible={false}
                editable
                save={{
                  onSave: handleSaveScript,
                  canSave: (t) => /kịch bản/i.test(t),
                  isSaved: (t) => savedTitles.has(t),
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!hasResult && !streaming && (
        <Card className="min-h-[220px] shadow-soft">
          <CardContent className="flex h-52 flex-col items-center justify-center gap-3 pt-6 text-center text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent">
              <Lightbulb className="size-6 text-primary" />
            </div>
            <p className="max-w-md text-sm">
              Nhập mô tả nội dung (và câu hook đang phân vân nếu có), chọn từ cảm
              xúc rồi bấm{" "}
              <span className="font-medium text-foreground">Tạo content</span>.
              AI sẽ gợi ý 5 hook ngắn và 3 kịch bản voice 35–50 giây.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
