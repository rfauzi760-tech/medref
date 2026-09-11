"use client";

import { useEffect, useState } from "react";

const RECENT_KEY = "medref:recent";
const FAV_KEY = "medref:favorites";

export interface ToolRef {
  href: string;
  title: string;
  group: string;
}

function read(key: string): ToolRef[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

export function useRecentTools() {
  const [recent, setRecent] = useState<ToolRef[]>([]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRecent(read(RECENT_KEY)));
    const onStorage = () => setRecent(read(RECENT_KEY));
    window.addEventListener("storage", onStorage);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const record = (ref: ToolRef) => {
    setRecent((prev) => {
      const next = [ref, ...prev.filter((r) => r.href !== ref.href)].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  };

  return { recent, record };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<ToolRef[]>([]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setFavorites(read(FAV_KEY)));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = (ref: ToolRef) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.href === ref.href);
      const next = exists ? prev.filter((f) => f.href !== ref.href) : [...prev, ref];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (href: string) => favorites.some((f) => f.href === href);
  return { favorites, toggle, isFavorite };
}

/** Record tool usage on mount (call from tool pages). */
export function useRecordVisit(ref: ToolRef) {
  const { record } = useRecentTools();
  useEffect(() => {
    record(ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.href]);
}