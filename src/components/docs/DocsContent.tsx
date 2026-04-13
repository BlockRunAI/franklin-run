import { cn } from "@/lib/utils";

interface DocsContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DocsContent({ title, description, children }: DocsContentProps) {
  return (
    <article className="w-full max-w-[720px]">
      <header className="mb-10">
        <h1 className="font-[family-name:var(--font-serif)] text-[36px] leading-[1.1] tracking-[-0.02em] text-white sm:text-[42px]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[16px] leading-7 text-white/50">
            {description}
          </p>
        )}
      </header>

      <div
        className={cn(
          // Headings
          "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[24px] [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-white",
          "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:text-white",
          "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-[16px] [&_h4]:font-semibold [&_h4]:text-white",

          // Paragraphs
          "[&_p]:mb-4 [&_p]:text-[15px] [&_p]:leading-7 [&_p]:text-white/70",

          // Links
          "[&_a]:text-[#10b981] [&_a]:underline-offset-2 [&_a:hover]:underline",

          // Lists
          "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_li]:mb-1.5 [&_li]:text-[15px] [&_li]:leading-7 [&_li]:text-white/70",
          "[&_li_ul]:mt-1.5 [&_li_ul]:mb-0",

          // Inline code
          "[&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]",

          // Horizontal rules
          "[&_hr]:my-8 [&_hr]:border-white/10",

          // Strong / em
          "[&_strong]:font-semibold [&_strong]:text-white",
          "[&_em]:italic",

          // Tables
          "[&_table]:mb-4 [&_table]:w-full [&_table]:text-[14px]",
          "[&_th]:border-b [&_th]:border-white/10 [&_th]:pb-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-white/80",
          "[&_td]:border-b [&_td]:border-white/5 [&_td]:py-2 [&_td]:text-white/60",

          // Blockquotes
          "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:text-white/50",
        )}
      >
        {children}
      </div>
    </article>
  );
}
