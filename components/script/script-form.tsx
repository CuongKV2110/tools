"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Clapperboard, Loader2, Wand2, Square, Copy, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Markdown } from "@/components/content/markdown-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export function ScriptForm() {
  const { getToken } = useAuth();

  const [customerPortrait, setCustomerPortrait] = useState("");
  const [industry, setIndustry] = useState("");

  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Nhận chân dung khách hàng chuyển sang từ trang "Chất liệu bản thân".
  useEffect(() => {
    const saved = sessionStorage.getItem("script:portrait");
    if (saved) {
      setCustomerPortrait(saved);
      sessionStorage.removeItem("script:portrait");
      toast.success("Đã nhận chân dung từ Chất liệu bản thân.");
    }
  }, []);

  async function handleRun() {
    if (!customerPortrait.trim()) {
      toast.error("Hãy nhập chân dung khách hàng.");
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
      const res = await fetch("/api/script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ customerPortrait, industry }),
        signal: controller.signal,
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
        setOutput(acc);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error((err as Error).message || "Không thể tạo kịch bản.");
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  const hasOutput = output.trim().length > 0;

  return (
    <div className="space-y-6">
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
            <Label htmlFor="industry">Lĩnh vực / ngành nghề + số năm kinh nghiệm</Label>
            <Input
              id="industry"
              placeholder="Ví dụ: làm nội dung hôn nhân – gia đình, 3 năm kinh nghiệm"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Quyết định “giọng người trong ngành” khi viết kịch bản.
            </p>
          </div>

          {isStreaming ? (
            <Button
              onClick={() => abortRef.current?.abort()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Square className="size-4" />
              Dừng
            </Button>
          ) : (
            <Button onClick={handleRun} className="w-full sm:w-auto">
              <Wand2 className="size-4" />
              Tạo kịch bản
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="min-h-[320px] shadow-soft">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clapperboard className="size-4 text-primary" />
              Phân tích &amp; 3 kịch bản HILLA
              {isStreaming && (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              )}
            </div>
            {hasOutput && !isStreaming && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(output)
                      .then(() => toast.success("Đã sao chép."))
                  }
                >
                  <Copy className="size-4" />
                  Sao chép
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => download("kich-ban-hilla.md", output)}
                >
                  <Download className="size-4" />
                  Xuất .md
                </Button>
              </div>
            )}
          </div>

          {hasOutput ? (
            <Markdown content={output} />
          ) : (
            <div className="flex h-56 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent">
                <Clapperboard className="size-6 text-primary" />
              </div>
              <p className="max-w-md text-sm">
                Nhập chân dung khách hàng rồi bấm{" "}
                <span className="font-medium text-foreground">Tạo kịch bản</span>
                . AI sẽ phân tích 5 nỗi đau + 3 mong muốn thầm kín và viết 3 kịch
                bản video theo công thức HILLA (60–90 giây).
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
