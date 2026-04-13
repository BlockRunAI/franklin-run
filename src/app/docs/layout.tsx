import type { Metadata } from "next";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export const metadata: Metadata = {
  title: {
    default: "Franklin Docs",
    template: "%s | Franklin Docs",
  },
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0a0d12] text-white">
      <DocsHeader />
      <div className="pt-[56px]">
        <div className="mx-auto flex max-w-[1320px]">
          {/* Desktop sidebar */}
          <aside className="hidden shrink-0 lg:block">
            <div className="sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto pl-6">
              <DocsSidebar />
            </div>
          </aside>

          {/* Content area */}
          <main className="min-w-0 flex-1 px-6 py-8 lg:px-12 lg:py-12">
            <div className="max-w-[760px]">
              {children}
            </div>
          </main>

          {/* Empty right margin for balance on wide screens */}
          <div className="hidden w-[200px] shrink-0 xl:block" />
        </div>
      </div>
    </div>
  );
}
