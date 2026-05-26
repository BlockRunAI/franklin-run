"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Local spend tracking for the /try preview — mirrors the "Total Spent" /
// "Cost by Model" metrics from Franklin's dashboard (src/panel + src/stats).
// Stored in the browser only; every paid x402 request adds its USDC amount.

const STORAGE_KEY = "franklin-try-usage-v1";

export interface Usage {
  totalUsd: number;
  requests: number;
  byModel: Record<string, { usd: number; count: number }>;
}

const EMPTY: Usage = { totalUsd: 0, requests: 0, byModel: {} };

function load(): Usage {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return { totalUsd: p.totalUsd || 0, requests: p.requests || 0, byModel: p.byModel || {} };
  } catch {
    return EMPTY;
  }
}

export function useUsageStats() {
  const [usage, setUsage] = useState<Usage>(EMPTY);
  const hydrated = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUsage(load());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
    } catch {
      /* ignore */
    }
  }, [usage]);

  const recordSpend = useCallback((model: string, usd: number) => {
    if (!usd || usd <= 0) return;
    setUsage((u) => {
      const prev = u.byModel[model] ?? { usd: 0, count: 0 };
      return {
        totalUsd: u.totalUsd + usd,
        requests: u.requests + 1,
        byModel: { ...u.byModel, [model]: { usd: prev.usd + usd, count: prev.count + 1 } },
      };
    });
  }, []);

  const reset = useCallback(() => setUsage(EMPTY), []);

  return { usage, recordSpend, reset };
}
