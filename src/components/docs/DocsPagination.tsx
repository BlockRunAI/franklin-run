import Link from "next/link";
import type { DocPage } from "@/lib/docs-navigation";

interface DocsPaginationProps {
  prev?: DocPage;
  next?: DocPage;
}

export function DocsPagination({ prev, next }: DocsPaginationProps) {
  return (
    <nav className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 text-[14px] text-white/50 transition-colors hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 text-[14px] text-white/50 transition-colors hover:text-white"
        >
          <span>{next.title}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
