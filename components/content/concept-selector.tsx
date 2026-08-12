"use client";

import { conceptsByGroup } from "@/lib/concepts";
import { SelectableCards } from "./selectable-cards";

export function ConceptSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const groups = conceptsByGroup();

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.id} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {g.label}
          </p>
          <SelectableCards items={g.items} value={value} onChange={onChange} />
        </div>
      ))}
    </div>
  );
}
