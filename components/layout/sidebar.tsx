"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav";

/** Shared nav links — reused by desktop sidebar and mobile drawer. */
export function SidebarNav({
  onNavigate,
  navId = "sidebar",
}: {
  onNavigate?: () => void;
  navId?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = item.match
          ? item.match(pathname)
          : pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={`${navId}-active`}
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon className="relative z-10 size-4 shrink-0 transition-transform group-hover:scale-110" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 px-5 py-5"
    >
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Sparkles className="size-5" />
      </div>
      <span className="text-base font-semibold tracking-tight">
        Content Support
      </span>
    </Link>
  );
}

/** Fixed desktop sidebar. */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <SidebarBrand />
      <SidebarNav />
      <div className="px-5 py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Content Support
      </div>
    </aside>
  );
}
