"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "./nav";

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
    <nav className="flex flex-1 flex-col gap-5 px-3 py-2">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-1">
          <p className="px-3 pb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {section.title}
          </p>
          {section.items.map((item) => {
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
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId={`${navId}-active`}
                    className="absolute inset-0 rounded-xl bg-accent ring-1 ring-primary/15"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {active && (
                  <motion.span
                    layoutId={`${navId}-bar`}
                    className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 size-[18px] shrink-0 transition-transform group-hover:scale-110",
                    active && "text-primary"
                  )}
                />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 px-5 py-5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png?v=2"
        alt="Content Support"
        className="size-9 rounded-xl object-contain"
      />
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
