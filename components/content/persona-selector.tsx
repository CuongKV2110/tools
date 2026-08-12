"use client";

import { PERSONAS } from "@/lib/personas";
import { SelectableCards } from "./selectable-cards";

export function PersonaSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return <SelectableCards items={PERSONAS} value={value} onChange={onChange} />;
}
