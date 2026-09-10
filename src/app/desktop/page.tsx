import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { DesktopPanel } from "@/components/try/DesktopPanel";
import { TryLangProvider } from "@/lib/try-i18n";
export const metadata: Metadata = {
  title: "Franklin Desktop — local tools, Agent Studio and team workspaces",
  description: "Get Franklin Desktop for local files, terminal tools, MCP integrations, Agent Studio and shared team workspaces.",
  alternates: { canonical: "https://franklin.run/desktop" },
};
export default function DesktopPage() {
  return <><Header variant="paper" /><main className="desktop-page"><TryLangProvider><DesktopPanel /></TryLangProvider></main></>;
}
