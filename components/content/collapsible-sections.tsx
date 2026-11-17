"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  PencilLine,
  Check,
} from "lucide-react";
import { Markdown } from "@/components/content/markdown-preview";
import { Textarea } from "@/components/ui/textarea";
import { cleanTitle } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SaveOptions {
  /** Called when the user saves a section (title + body markdown). */
  onSave: (title: string, body: string) => void;
  /** Only show the save button for sections where this returns true. */
  canSave?: (title: string) => boolean;
  /** Whether a section is already saved (shows a "saved" state). */
  isSaved?: (title: string) => boolean;
}

interface Section {
  level: number;
  title: string;
  body: string;
}

/** Split Markdown into sections at level-2/3 headings (## / ###). */
function splitSections(md: string): Section[] {
  const lines = md.split("\n");
  const sections: Section[] = [];
  let cur: Section | null = null;
  let preamble = "";

  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.*)$/);
    if (m) {
      if (cur) sections.push(cur);
      cur = { level: m[1].length, title: cleanTitle(m[2]), body: "" };
    } else if (cur) {
      cur.body += line + "\n";
    } else {
      preamble += line + "\n";
    }
  }
  if (cur) sections.push(cur);

  // Any text before the first heading becomes an untitled lead section.
  if (preamble.trim()) {
    sections.unshift({ level: 0, title: "", body: preamble });
  }
  return sections;
}

const ACCENTS = [
  "from-indigo-500 to-violet-500",
  "from-rose-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-amber-500 to-yellow-500",
];

function SectionCard({
  section,
  index,
  defaultOpen,
  save,
  collapsible = true,
  editable = false,
}: {
  section: Section;
  index: number;
  defaultOpen: boolean;
  save?: SaveOptions;
  /** When false, the card is always expanded with no toggle/chevron. */
  collapsible?: boolean;
  /** When true (and the section is saveable), show an inline edit button. */
  editable?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  // Editable draft of the body — lets the user tweak a script before saving.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(section.body);
  // Reset the draft when a new generation replaces the underlying content.
  useEffect(() => {
    setDraft(section.body);
    setEditing(false);
  }, [section.body]);

  const accent = ACCENTS[index % ACCENTS.length];
  const showSave = !!save && (save.canSave?.(section.title) ?? true);
  const saved = save?.isSaved?.(section.title) ?? false;
  const canEdit = editable && showSave;
  // The body used for display and saving (edited draft when editable).
  const body = editable ? draft : section.body;

  // A section with no heading title is just rendered inline (the lead text).
  if (!section.title) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <Markdown content={section.body} />
      </div>
    );
  }

  const saveButton = showSave ? (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        if (!saved) save!.onSave(section.title, body);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          if (!saved) save!.onSave(section.title, body);
        }
      }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
        saved
          ? "bg-emerald-50 text-emerald-600"
          : "bg-primary/10 text-primary hover:bg-primary/20"
      )}
    >
      {saved ? (
        <>
          <BookmarkCheck className="size-3.5" />
          Đã lưu
        </>
      ) : (
        <>
          <Bookmark className="size-3.5" />
          Lưu
        </>
      )}
    </span>
  ) : null;

  const editButton = canEdit ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setEditing((v) => !v);
      }}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
        editing
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent"
      )}
    >
      {editing ? (
        <>
          <Check className="size-3.5" />
          Xong
        </>
      ) : (
        <>
          <PencilLine className="size-3.5" />
          Sửa
        </>
      )}
    </button>
  ) : null;

  // Non-collapsible: always-open card, header with no toggle/chevron.
  if (!collapsible) {
    return (
      <div className="overflow-hidden rounded-xl border border-primary/30 bg-card shadow-soft">
        <div className="flex w-full items-center gap-3 px-4 py-3">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white shadow-sm",
              accent
            )}
          >
            {index + 1}
          </span>
          <span
            className={cn(
              "flex-1 font-semibold leading-snug",
              section.level >= 3 ? "text-sm" : "text-base"
            )}
          >
            {section.title}
          </span>
          {editButton}
          {saveButton}
        </div>
        <div className="border-t border-border/70 px-4 py-3">
          {editing ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={Math.min(22, Math.max(8, draft.split("\n").length + 1))}
              className="resize-y font-mono text-sm leading-relaxed"
            />
          ) : (
            <Markdown content={body} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-soft transition-shadow hover:shadow-soft-lg",
        open ? "border-primary/30" : "border-border"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-bold text-white shadow-sm",
            accent
          )}
        >
          {index + 1}
        </span>
        <span
          className={cn(
            "flex-1 font-semibold leading-snug",
            section.level >= 3 ? "text-sm" : "text-base"
          )}
        >
          {section.title}
        </span>
        {saveButton}
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/70 px-4 py-3">
              <Markdown content={section.body} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Render long AI Markdown output as a stack of collapsible cards (accordion),
 * split at ## / ### headings — far easier to scan than one wall of text.
 * Falls back to plain Markdown when there are no headings.
 */
export function CollapsibleSections({
  content,
  save,
  collapsible = true,
  editable = false,
}: {
  content: string;
  save?: SaveOptions;
  /** When false, every section renders fully expanded with no toggle. */
  collapsible?: boolean;
  /** When true, saveable sections get an inline "Sửa" (edit) button. */
  editable?: boolean;
}) {
  const sections = useMemo(() => splitSections(content), [content]);

  if (sections.length <= 1) {
    return <Markdown content={content} />;
  }

  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <SectionCard
          key={i}
          section={s}
          index={i}
          defaultOpen={i === 0}
          save={s.title ? save : undefined}
          collapsible={collapsible}
          editable={editable}
        />
      ))}
    </div>
  );
}
