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
  /** Match nested routes too (e.g. /chatbots/new). */
  match?: (pathname: string) => boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    match: (p) => p === "/dashboard",
  },
  {
    label: "Tạo Content",
    href: "/create",
    icon: PenLine,
    match: (p) => p.startsWith("/create"),
  },
  {
    label: "Quản lý Content",
    href: "/board",
    icon: KanbanSquare,
    match: (p) => p.startsWith("/board"),
  },
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
  {
    label: "Cài đặt",
    href: "/settings",
    icon: Settings,
    match: (p) => p.startsWith("/settings"),
  },
];

/** Human-readable title for the header, per top-level route. */
export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Tổng quan",
  "/create": "Tạo Content AI",
  "/board": "Quản lý Content",
  "/concepts": "Concept viral",
  "/material": "Chất liệu bản thân",
  "/script": "Kịch bản video",
  "/settings": "Cài đặt",
};

export function titleForPath(pathname: string): string {
  const key = Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k));
  return key ? PAGE_TITLES[key] : "Content Support";
}
