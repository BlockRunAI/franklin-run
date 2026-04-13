import { cn } from "@/lib/utils";

const CALLOUT_STYLES = {
  info: {
    border: "border-l-[#60a5fa]",
    bg: "bg-[#60a5fa]/5",
    titleColor: "text-[#60a5fa]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#60a5fa]">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    defaultTitle: "Info",
  },
  tip: {
    border: "border-l-[#10b981]",
    bg: "bg-[#10b981]/5",
    titleColor: "text-[#10b981]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#10b981]">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    defaultTitle: "Tip",
  },
  warning: {
    border: "border-l-[#FFD700]",
    bg: "bg-[#FFD700]/5",
    titleColor: "text-[#FFD700]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#FFD700]">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    defaultTitle: "Warning",
  },
  danger: {
    border: "border-l-[#ef4444]",
    bg: "bg-[#ef4444]/5",
    titleColor: "text-[#ef4444]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#ef4444]">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    defaultTitle: "Danger",
  },
} as const;

interface CalloutProps {
  type: "info" | "tip" | "warning" | "danger";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type, title, children }: CalloutProps) {
  const style = CALLOUT_STYLES[type];

  return (
    <div
      className={cn(
        "my-5 rounded-r-lg border-l-4 px-4 py-3",
        style.border,
        style.bg,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {style.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("mb-1 text-[14px] font-semibold", style.titleColor)}>
            {title ?? style.defaultTitle}
          </p>
          <div className="text-[14px] leading-6 text-white/70 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_p]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
