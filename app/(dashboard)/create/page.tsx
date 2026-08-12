import { PenLine } from "lucide-react";
import { GenerationForm } from "@/components/content/generation-form";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/motion";

export default function CreatePage() {
  return (
    <FadeIn className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={PenLine}
        title="Tạo nội dung với AI"
        subtitle="Biến ý tưởng thô thành bài viết hoàn chỉnh theo phong cách bạn chọn."
      />
      <GenerationForm />
    </FadeIn>
  );
}
