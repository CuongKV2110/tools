"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarBrand, SidebarNav } from "./sidebar";
import { UserNav } from "./user-nav";
import { titleForPath } from "./nav";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="lg:hidden" />}
        >
          <Menu className="size-5" />
          <span className="sr-only">Mở menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Điều hướng</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <SidebarBrand />
            <SidebarNav navId="mobile" onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <h1 className="flex-1 truncate text-lg font-semibold tracking-tight">
        {titleForPath(pathname)}
      </h1>

      <UserNav />
    </header>
  );
}
