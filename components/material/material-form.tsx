"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Fingerprint,
  Loader2,
  Wand2,
  Square,
  Copy,
  Download,
  Clapperboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Markdown } from "@/components/content/markdown-preview";
import { CollapsibleSections } from "@/components/content/collapsible-sections";
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

export function MaterialForm() {
  const { getToken } = useAuth();
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function handleAnalyze() {
    if (!productName.trim() || !productDescription.trim()) {
      toast.error("Hãy nhập Tên và Mô tả sản phẩm.");
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
      const res = await fetch("/api/material", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName,
          productDescription,
          targetAudience,
        }),
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
        toast.error((err as Error).message || "Không thể phân tích.");
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
            <Label htmlFor="pname">Tên sản phẩm / kênh / thương hiệu *</Label>
            <Input
              id="pname"
              placeholder="Ví dụ: Cường tập làm chồng"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdesc">Mô tả chi tiết (chất liệu bản thân) *</Label>
            <Textarea
              id="pdesc"
              rows={6}
              placeholder="Bạn là ai, câu chuyện, phong cách, sản phẩm/kênh nói về gì… Càng chi tiết, phân tích càng sát."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aud">Nhóm người xem mục tiêu (tuỳ chọn)</Label>
            <Input
              id="aud"
              placeholder="Để trống → AI sẽ tự xác định ở Phần 1"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
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
            <Button onClick={handleAnalyze} className="w-full sm:w-auto">
              <Wand2 className="size-4" />
              Phân tích
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="min-h-[320px] shadow-soft">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Fingerprint className="size-4 text-primary" />
              Kết quả phân tích
              {isStreaming && (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              )}
            </div>
            {hasOutput && !isStreaming && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    sessionStorage.setItem("script:portrait", output);
                    router.push("/script");
                  }}
                >
                  <Clapperboard className="size-4" />
                  Gửi sang Kịch bản
                </Button>
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
                  onClick={() =>
                    download(
                      `${productName.trim() || "chat-lieu"}.md`,
                      output
                    )
                  }
                >
                  <Download className="size-4" />
                  Xuất .md
                </Button>
              </div>
            )}
          </div>

          {hasOutput ? (
            isStreaming ? (
              <Markdown content={output} />
            ) : (
              <CollapsibleSections content={output} />
            )
          ) : (
            <div className="flex h-56 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent">
                <Fingerprint className="size-6 text-primary" />
              </div>
              <p className="max-w-md text-sm">
                Nhập thông tin bên trên rồi bấm{" "}
                <span className="font-medium text-foreground">Phân tích</span>.
                AI sẽ xác định 5 tệp người xem, chấm điểm, đề xuất nhóm lý tưởng
                và vẽ chân dung khách hàng chi tiết theo 11 hạng mục.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
