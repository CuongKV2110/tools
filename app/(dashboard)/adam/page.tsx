import { Lightbulb } from "lucide-react";
import { AdamForm } from "@/components/adam/adam-form";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/motion";

export default function AdamPage() {
  return (
    <FadeIn className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        icon={Lightbulb}
        title="Kịch bản Adam"
        subtitle="Từ câu hook + mô tả nội dung + từ cảm xúc → 5 hook ngắn & 3 kịch bản voice 35–50 giây."
      />
      <AdamForm />
    </FadeIn>
  );
}
