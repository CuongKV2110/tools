"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectableItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export function SelectableCards({
  items,
  value,
  onChange,
}: {
  items: SelectableItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "group relative flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all",
              active
                ? "border-primary ring-2 ring-primary/20 shadow-soft"
                : "border-border hover:border-primary/40 hover:shadow-soft"
            )}
          >
            <span className="text-2xl leading-none">{item.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{item.name}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {item.description}
              </span>
            </span>
            {active && (
              <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
