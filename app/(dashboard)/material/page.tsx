import { Fingerprint } from "lucide-react";
import { MaterialForm } from "@/components/material/material-form";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/motion";

export default function MaterialPage() {
  return (
    <FadeIn className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        icon={Fingerprint}
        title="Xác định chất liệu bản thân"
        subtitle="AI xác định tệp người xem mục tiêu và phân tích chân dung khách hàng chuyên sâu."
      />
      <MaterialForm />
    </FadeIn>
  );
}
