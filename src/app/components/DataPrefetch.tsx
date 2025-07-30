"use client";

import { useTokenListQuery } from "@/hooks/useTokens";

export default function DataPrefetch() {
  useTokenListQuery({ enabled: true });
  return null;
}
