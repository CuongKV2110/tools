import { Flame } from "lucide-react";
import { ConceptLibrary } from "@/components/content/concept-library";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/motion";

export default function ConceptsPage() {
  return (
    <FadeIn className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        icon={Flame}
        title="Concept viral"
        subtitle="Bấm vào từng concept để xem vì sao viral, ví dụ tiêu đề/hook và câu chuyện demo."
      />
      <ConceptLibrary />
    </FadeIn>
  );
}
