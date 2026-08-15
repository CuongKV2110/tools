"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Clapperboard,
  Loader2,
  Wand2,
  Square,
  Copy,
  Download,
  Sparkles,
  BrainCircuit,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createContent } from "@/hooks/use-contents";
import {
  DEFAULT_CONTENT_MODEL,
  countWords,
  cleanTitle,
} from "@/lib/constants";
import { Markdown } from "@/components/content/markdown-preview";
import { CollapsibleSections } from "@/components/content/collapsible-sections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Phase = "none" | "analysis" | "scripts";

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ScriptForm() {
  const { user, getToken } = useAuth();

  const [customerPortrait, setCustomerPortrait] = useState("");
  const [summary, setSummary] = useState("");

  const [analysis, setAnalysis] = useState("");
  const [scripts, setScripts] = useState("");
  const [phase, setPhase] = useState<Phase>("none");
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  async function handleSaveScript(title: string, body: string) {
    if (!user) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }
    const cleanName = cleanTitle(title) || "Kịch bản video";
    try {
      await createContent({
        ownerId: user.uid,
        kind: "script",
        title: cleanName,
        rawInput: summary || customerPortrait.slice(0, 200),
        body: body.trim(),
        personaId: "",
        conceptId: "",
        formula: "",
        tone: "friendly",
        length: "medium",
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

  // Nhận chân dung khách hàng chuyển sang từ trang "Chất liệu bản thân".
  useEffect(() => {
    const saved = sessionStorage.getItem("script:portrait");
    if (saved) {
      setCustomerPortrait(saved);
      sessionStorage.removeItem("script:portrait");
      toast.success("Đã nhận chân dung từ Chất liệu bản thân.");
    }
  }, []);

  /** Stream one step from the API into `onChunk`. */
  async function run(
    mode: "analysis" | "scripts",
    onChunk: (acc: string) => void
  ) {
    if (!customerPortrait.trim()) {
      toast.error("Hãy nhập chân dung khách hàng.");
      return;
    }
    const token = await getToken();
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }

    setPhase(mode);
    onChunk("");
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerPortrait,
          summary,
          mode,
          analysis: mode === "scripts" ? analysis : undefined,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(
          (await res.text().catch(() => "")) || `Lỗi ${res.status}`
        );
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
      // Empty result usually means the model was overloaded (503) mid-stream.
      if (!acc.trim()) {
        toast.error(
          "Model AI đang quá tải, chưa trả về kết quả. Vui lòng thử lại sau vài giây."
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
      setPhase("none");
      abortRef.current = null;
    }
  }

  function handleAnalyze() {
    setScripts(""); // new analysis invalidates old scripts
    run("analysis", setAnalysis);
  }

  function handleScripts() {
    setSavedTitles(new Set());
    run("scripts", setScripts);
  }

  const hasAnalysis = analysis.trim().length > 0;
  const hasScripts = scripts.trim().length > 0;
  const streaming = phase !== "none";

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <Card className="shadow-soft">
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="portrait">Chân dung khách hàng mục tiêu *</Label>
            <Textarea
              id="portrait"
              rows={5}
              placeholder={
                "Dán chân dung khách hàng (có thể lấy từ 'Chất liệu bản thân').\nVí dụ: Nam giới 23–28 tuổi mới cưới hoặc chuẩn bị cưới trong 1–3 năm tới; đi làm, có trách nhiệm, yêu vợ nhưng chưa biết cách thể hiện tình cảm trong hôn nhân."
              }
              value={customerPortrait}
              onChange={(e) => setCustomerPortrait(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Tóm tắt kịch bản mà bạn muốn tạo</Label>
            <Textarea
              id="summary"
              rows={3}
              placeholder="Ví dụ: kịch bản kể về khoảnh khắc chồng lần đầu hiểu cảm xúc của vợ; thông điệp: đàn ông cần học cách lắng nghe thay vì giải quyết."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Nêu chủ đề / thông điệp / hướng đi bạn muốn — AI sẽ bám sát khi
              viết kịch bản.
            </p>
          </div>

          {phase === "analysis" ? (
            <Button
              onClick={() => abortRef.current?.abort()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Square className="size-4" />
              Dừng
            </Button>
          ) : (
            <Button
              onClick={handleAnalyze}
              disabled={streaming}
              className="w-full sm:w-auto"
            >
              <BrainCircuit className="size-4" />
              Phân tích nỗi đau &amp; mong muốn
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Step 1 result: analysis */}
      {(hasAnalysis || phase === "analysis") && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BrainCircuit className="size-4 text-primary" />
                Bước 1 · Phân tích nỗi đau &amp; mong muốn
                {phase === "analysis" && (
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                )}
              </div>
              {hasAnalysis && phase !== "analysis" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(analysis)
                      .then(() => toast.success("Đã sao chép."))
                  }
                >
                  <Copy className="size-4" />
                  Sao chép
                </Button>
              )}
            </div>

            {phase === "analysis" ? (
              <Markdown content={analysis} />
            ) : (
              <CollapsibleSections content={analysis} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Bridge: ask before generating scripts (step 2) */}
      {hasAnalysis && !hasScripts && phase === "none" && (
        <Card className="border-primary/30 bg-accent/40 shadow-soft">
          <CardContent className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Đã phân tích xong. Bạn có muốn AI viết tiếp{" "}
              <span className="font-medium text-foreground">
                3 kịch bản video HILLA
              </span>{" "}
              dựa trên phân tích này không?
            </p>
            <Button onClick={handleScripts} className="mt-1">
              <Wand2 className="size-4" />
              Xuất 3 kịch bản HILLA
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2 result: scripts */}
      {(hasScripts || phase === "scripts") && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clapperboard className="size-4 text-primary" />
                Bước 2 · 3 kịch bản HILLA
                {phase === "scripts" && (
                  <Loader2 className="size-3.5 animate-spin text-primary" />
                )}
              </div>
              <div className="flex gap-2">
                {phase === "scripts" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => abortRef.current?.abort()}
                  >
                    <Square className="size-4" />
                    Dừng
                  </Button>
                ) : (
                  hasScripts && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigator.clipboard
                            .writeText(scripts)
                            .then(() => toast.success("Đã sao chép."))
                        }
                      >
                        <Copy className="size-4" />
                        Sao chép
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => download("kich-ban-hilla.md", scripts)}
                      >
                        <Download className="size-4" />
                        Xuất .md
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>

            {phase === "scripts" ? (
              <Markdown content={scripts} />
            ) : (
              <CollapsibleSections
                content={scripts}
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
      {!hasAnalysis && phase === "none" && (
        <Card className="min-h-[220px] shadow-soft">
          <CardContent className="flex h-52 flex-col items-center justify-center gap-3 pt-6 text-center text-muted-foreground">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-accent">
              <Clapperboard className="size-6 text-primary" />
            </div>
            <p className="max-w-md text-sm">
              Nhập chân dung khách hàng rồi bấm{" "}
              <span className="font-medium text-foreground">
                Phân tích nỗi đau &amp; mong muốn
              </span>
              . Sau đó bạn có thể chọn xuất tiếp 3 kịch bản HILLA.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
