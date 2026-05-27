import type { Metadata } from "next";
import Link from "next/link";
import { DocsContent } from "@/components/docs/DocsContent";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Reference",
  description: "CLI commands, configuration files, pricing, and frequently asked questions.",
};

const PAGE_PATH = "/docs/reference";

export default function ReferencePage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Reference"
        description="CLI commands, configuration files, pricing, and frequently asked questions."
      >
        <p>
          Complete reference documentation for Franklin&apos;s CLI, configuration,
          pricing model, and common questions.
        </p>

        <h2>What&apos;s Inside</h2>
        <ul>
          <li>
            <Link href="/docs/reference/cli">CLI</Link>
            &nbsp;&mdash; every command and flag
          </li>
          <li>
            <Link href="/docs/reference/configuration">Configuration</Link>
            &nbsp;&mdash; the <code>~/.blockrun/</code> directory structure and
            key config files
          </li>
          <li>
            <Link href="/docs/reference/pricing">Pricing</Link>
            &nbsp;&mdash; pay-per-action micropayments, free tier, and cost
            tracking
          </li>
          <li>
            <Link href="/docs/reference/faq">FAQ</Link>
            &nbsp;&mdash; frequently asked questions about models, payments,
            privacy, and more
          </li>
        </ul>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
