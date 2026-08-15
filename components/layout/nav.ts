import {
  LayoutDashboard,
  PenLine,
  KanbanSquare,
  Flame,
  Fingerprint,
  Clapperboard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match nested routes too (e.g. /create/123). */
  match?: (pathname: string) => boolean;
}

export interface NavSection {
  /** Section heading shown above the group (uppercase). */
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Nội dung",
    items: [
      {
        label: "Tổng quan",
        href: "/dashboard",
        icon: LayoutDashboard,
        match: (p) => p === "/dashboard",
      },
      {
        label: "Tạo nội dung",
        href: "/create",
        icon: PenLine,
        match: (p) => p.startsWith("/create"),
      },
      {
        label: "Quản lý nội dung",
        href: "/board",
        icon: KanbanSquare,
        match: (p) => p.startsWith("/board"),
      },
    ],
  },
  {
    title: "Công cụ viral",
    items: [
      {
        label: "Concept viral",
        href: "/concepts",
        icon: Flame,
        match: (p) => p.startsWith("/concepts"),
      },
      {
        label: "Chất liệu bản thân",
        href: "/material",
        icon: Fingerprint,
        match: (p) => p.startsWith("/material"),
      },
      {
        label: "Kịch bản video",
        href: "/script",
        icon: Clapperboard,
        match: (p) => p.startsWith("/script"),
      },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      {
        label: "Cài đặt",
        href: "/settings",
        icon: Settings,
        match: (p) => p.startsWith("/settings"),
      },
    ],
  },
];

/** Flat list (kept for any consumer that needs all items). */
export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

/** Human-readable title for the header, per top-level route. */
export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Tổng quan",
  "/create": "Tạo nội dung AI",
  "/board": "Quản lý nội dung",
  "/concepts": "Concept viral",
  "/material": "Chất liệu bản thân",
  "/script": "Kịch bản video",
  "/settings": "Cài đặt",
};

export function titleForPath(pathname: string): string {
  const key = Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k));
  return key ? PAGE_TITLES[key] : "Content Support";
}
