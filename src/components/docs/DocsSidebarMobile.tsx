"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DocsSidebar } from "./DocsSidebar";

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface DocsSidebarMobileProps {
  currentPath: string;
}

export function DocsSidebarMobile({ currentPath }: DocsSidebarMobileProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center text-white/60 transition-colors hover:text-white lg:hidden"
        aria-label="Open navigation menu"
      >
        <MenuIcon />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className={cn(
            "absolute inset-y-0 left-0 w-[280px] overflow-y-auto bg-[#0a0d12] shadow-2xl shadow-black/50",
          )}>
            {/* Close button */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-[14px] font-semibold text-white">
                Documentation
              </span>
              <button
                type="button"
                onClick={close}
                className="flex items-center justify-center text-white/60 transition-colors hover:text-white"
                aria-label="Close navigation menu"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="px-4">
              <DocsSidebar currentPath={currentPath} onLinkClick={close} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
