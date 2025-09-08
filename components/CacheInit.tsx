"use client";
import { useEffect } from "react";
import { initCacheFlag } from "@/utils/cacheUtils";

export default function CacheInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initCacheFlag();
  }, []);
  return <>{children}</>;
}
