"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { docsNavigation, type DocSection } from "@/lib/docs-navigation";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "transition-transform duration-150",
        open ? "rotate-90" : "rotate-0",
      )}
    >
      <polyline points="4 2 8 6 4 10" />
    </svg>
  );
}

interface DocsSidebarProps {
  currentPath?: string;
  onLinkClick?: () => void;
}

export function DocsSidebar({ currentPath, onLinkClick }: DocsSidebarProps) {
  const routerPathname = usePathname();
  const pathname = currentPath ?? routerPathname;
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleSection(sectionTitle: string) {
    setCollapsed((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  }

  function isSectionExpanded(section: DocSection): boolean {
    if (collapsed[section.title] !== undefined) {
      return !collapsed[section.title];
    }
    return true;
  }

  return (
    <nav className="w-[240px] shrink-0 overflow-y-auto py-6 pr-4" aria-label="Documentation sidebar">
      <div className="space-y-6">
        {docsNavigation.map((section) => {
          const expanded = isSectionExpanded(section);

          return (
            <div key={section.title}>
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between pb-2 text-left"
              >
                <span className="text-[12px] font-semibold uppercase tracking-wider text-white/40">
                  {section.title}
                </span>
                <ChevronIcon open={expanded} />
              </button>

              {expanded && section.pages && (
                <ul className="space-y-0.5">
                  {section.pages.map((page) => {
                    const isActive = pathname === page.href;

                    return (
                      <li key={page.href}>
                        <Link
                          href={page.href}
                          onClick={onLinkClick}
                          className={cn(
                            "block rounded-md py-1.5 pl-4 text-[14px] transition-colors",
                            isActive
                              ? "bg-white/8 font-medium text-white"
                              : "text-white/50 hover:text-white/70",
                          )}
                        >
                          {page.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
