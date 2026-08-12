/** Client-safe constants (no server-only imports). */
import type { ContentStatus, ContentTone, ContentLength } from "@/types";

export const DEFAULT_CONTENT_MODEL = "gemini-flash-latest";

export const TONE_OPTIONS: { value: ContentTone; label: string }[] = [
  { value: "friendly", label: "Thân thiện" },
  { value: "professional", label: "Chuyên nghiệp" },
  { value: "inspirational", label: "Truyền cảm hứng" },
  { value: "witty", label: "Dí dỏm" },
  { value: "authoritative", label: "Uy tín" },
];

export const LENGTH_OPTIONS: { value: ContentLength; label: string }[] = [
  { value: "short", label: "Ngắn (~150–250 từ)" },
  { value: "medium", label: "Vừa (~400–600 từ)" },
  { value: "long", label: "Dài (~800–1200 từ)" },
];

export const STATUS_OPTIONS: {
  value: ContentStatus;
  label: string;
  className: string;
}[] = [
  {
    value: "draft",
    label: "Nháp",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    value: "published",
    label: "Đã xuất bản",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    value: "archived",
    label: "Lưu trữ",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export const statusMeta = (status: ContentStatus) =>
  STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0];

/** Derive a title from generated markdown (first heading) or fall back. */
export function deriveTitle(markdown: string, fallback: string): string {
  const heading = markdown
    .split("\n")
    .map((l) => l.trim())
    .find((l) => /^#{1,3}\s+/.test(l));
  if (heading) return heading.replace(/^#{1,3}\s+/, "").slice(0, 120);
  const firstLine = markdown.trim().split("\n")[0]?.trim();
  if (firstLine) return firstLine.slice(0, 120);
  return fallback.slice(0, 120) || "Nội dung chưa đặt tên";
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/* ---- Cấu trúc bài viết: [HOOKS] / [THANBAI] / [KET] ---- */
export interface ContentSections {
  hooks: string;
  body: string;
  ket: string;
}

/** Tách output theo các nhãn [HOOKS], [THANBAI], [KET] (chịu được stream dở). */
export function splitContentSections(raw: string): ContentSections {
  const res: ContentSections = { hooks: "", body: "", ket: "" };
  if (!raw) return res;

  const re = /\[(HOOKS|THANBAI|KET)\]/gi;
  const marks: { key: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    marks.push({ key: m[1].toUpperCase(), start: m.index, end: re.lastIndex });
  }

  if (marks.length === 0) {
    res.body = raw;
    return res;
  }

  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].end;
    const end = i + 1 < marks.length ? marks[i + 1].start : raw.length;
    const text = raw.slice(start, end).trim();
    if (marks[i].key === "HOOKS") res.hooks = text;
    else if (marks[i].key === "THANBAI") res.body = text;
    else if (marks[i].key === "KET") res.ket = text;
  }
  return res;
}

/** Tách phần [HOOKS] thành từng câu hook (bỏ số thứ tự, gạch đầu dòng, ngoặc kép). */
export function parseHooks(hooks: string): string[] {
  return hooks
    .split("\n")
    .map((l) =>
      l
        .replace(/^\s*\d+[.)]\s*/, "")
        .replace(/^\s*[-*]\s*/, "")
        .replace(/^\s*["“”']+|["“”']+\s*$/g, "")
        .trim()
    )
    .filter(Boolean)
    .slice(0, 8);
}

/** Ghép lại thành Markdown sạch (bỏ nhãn) để lưu / sao chép / xuất file. */
export function toCleanMarkdown(raw: string): string {
  const { hooks, body, ket } = splitContentSections(raw);
  const parts: string[] = [];
  if (hooks) parts.push(`## 🎣 Hook gợi ý\n\n${hooks}`);
  if (body) parts.push(`## 📄 Thân bài\n\n${body}`);
  if (ket) parts.push(`## 🏁 Kết\n\n${ket}`);
  return parts.join("\n\n") || raw;
}
