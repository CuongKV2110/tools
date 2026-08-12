import { Clapperboard } from "lucide-react";
import { ScriptForm } from "@/components/script/script-form";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/motion";

export default function ScriptPage() {
  return (
    <FadeIn className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        icon={Clapperboard}
        title="Kịch bản video"
        subtitle="Từ chân dung khách hàng → phân tích nỗi đau & mong muốn → 3 kịch bản HILLA."
      />
      <ScriptForm />
    </FadeIn>
  );
}
