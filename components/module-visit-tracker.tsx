"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { modules } from "@/lib/nav";
import { useRecentTools } from "@/components/use-local-store";

export function ModuleVisitTracker() {
  const pathname = usePathname();
  const { record } = useRecentTools();

  useEffect(() => {
    const item = modules.find((module) => module.href === pathname);
    if (item && pathname !== "/") {
      record({ href: item.href, title: item.name, group: "modul" });
    }
    // `record` is recreated when local state changes; the pathname is the visit trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
