import type { Pillar } from "@/lib/blog";
import { PILLARS } from "@/lib/blog";

interface PillarBadgeProps {
  pillar: Pillar;
  locale?: string;
}

export function PillarBadge({ pillar, locale }: PillarBadgeProps) {
  const meta = PILLARS[pillar];
  const label = locale === "zh-CN" ? meta.labelZh : meta.label;
  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-[rgba(201,162,39,0.4)] bg-[rgba(201,162,39,0.08)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold-dim)]">
      <span className="h-1 w-1 rounded-full bg-[var(--gold)]" />
      {label}
    </span>
  );
}
