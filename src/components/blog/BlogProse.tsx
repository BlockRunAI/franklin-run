import { cn } from "@/lib/utils";

interface BlogProseProps {
  children: React.ReactNode;
  locale?: string;
  dir?: "ltr" | "rtl";
  className?: string;
}

export function BlogProse({
  children,
  locale,
  dir = "ltr",
  className,
}: BlogProseProps) {
  const isCJK = locale === "zh-CN" || locale === "ja" || locale === "ko";
  return (
    <div
      dir={dir}
      className={cn(
        "blog-prose",
        isCJK && "blog-prose-cjk",
        dir === "rtl" && "blog-prose-rtl",
        // Headings
        "[&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:font-[family-name:var(--font-serif)] [&_h2]:text-[34px] [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.02em] [&_h2]:text-[var(--ink)]",
        "[&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:font-[family-name:var(--font-serif)] [&_h3]:text-[24px] [&_h3]:leading-snug [&_h3]:text-[var(--ink)]",
        "[&_h4]:mt-7 [&_h4]:mb-2 [&_h4]:text-[18px] [&_h4]:font-semibold [&_h4]:text-[var(--ink)]",
        // Body
        "[&_p]:mb-5 [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-[rgba(10,13,18,0.78)]",
        // Lead first paragraph
        "[&>p:first-child]:text-[20px] [&>p:first-child]:leading-[1.6] [&>p:first-child]:text-[rgba(10,13,18,0.84)]",
        // Links
        "[&_a]:text-[var(--gold-dim)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[rgba(140,111,23,0.4)] [&_a:hover]:decoration-[var(--gold-dim)]",
        // Lists
        "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mb-2 [&_li]:text-[17px] [&_li]:leading-[1.7] [&_li]:text-[rgba(10,13,18,0.78)]",
        // Inline code
        "[&_code]:rounded [&_code]:bg-[rgba(10,13,18,0.06)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[14px] [&_code]:text-[var(--ink)]",
        // Block code — banknote terminal
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-[rgba(201,162,39,0.32)] [&_pre]:bg-[#0c0e14] [&_pre]:p-5 [&_pre]:text-[13px] [&_pre]:leading-[1.6] [&_pre]:shadow-[0_2px_0_0_rgba(201,162,39,0.18),0_20px_40px_-20px_rgba(10,13,18,0.4)]",
        "[&_pre_code]:block [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-mono [&_pre_code]:text-[#10b981]/90 [&_pre_code]:text-[13px]",
        "[&_pre_code]:[unicode-bidi:plaintext] [&_pre]:[unicode-bidi:plaintext] [&_pre]:text-left",
        // Strong / em
        "[&_strong]:font-semibold [&_strong]:text-[var(--ink)]",
        "[&_em]:italic [&_em]:text-[var(--gold-dim)]",
        // Blockquotes — banknote pull quote
        "[&_blockquote]:my-7 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--gold)] [&_blockquote]:pl-6 [&_blockquote]:font-[family-name:var(--font-serif)] [&_blockquote]:text-[22px] [&_blockquote]:leading-[1.45] [&_blockquote]:text-[var(--ink)]",
        "[&_blockquote_p]:text-[22px] [&_blockquote_p]:leading-[1.45] [&_blockquote_p]:text-[var(--ink)]",
        // Tables
        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[15px]",
        "[&_th]:border-b [&_th]:border-[rgba(10,13,18,0.16)] [&_th]:py-2.5 [&_th]:pr-4 [&_th]:text-left [&_th]:font-semibold [&_th]:text-[var(--ink)]",
        "[&_td]:border-b [&_td]:border-[rgba(10,13,18,0.08)] [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top [&_td]:text-[rgba(10,13,18,0.78)]",
        // HR — banknote rule
        "[&_hr]:my-10 [&_hr]:border-0 [&_hr]:h-px [&_hr]:bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.55),transparent)]",
        // Inline images — banknote-framed
        "[&_img]:my-7 [&_img]:w-full [&_img]:rounded-md [&_img]:border [&_img]:border-[rgba(201,162,39,0.4)] [&_img]:shadow-[0_2px_0_0_rgba(201,162,39,0.18),0_30px_60px_-30px_rgba(10,13,18,0.25)]",
        "[&_p:has(>img)]:my-0",
        // CJK font when applicable
        isCJK &&
          "[&_p]:font-[family-name:var(--font-serif-sc)] [&_p]:text-[17px] [&_p]:leading-[1.85] [&_li]:font-[family-name:var(--font-serif-sc)] [&_blockquote]:font-[family-name:var(--font-serif-sc)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
