import type { Metadata } from "next";
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
            <a href="/docs/reference/cli">CLI</a>
            &nbsp;&mdash; every command and flag
          </li>
          <li>
            <a href="/docs/reference/configuration">Configuration</a>
            &nbsp;&mdash; the <code>~/.blockrun/</code> directory structure and
            key config files
          </li>
          <li>
            <a href="/docs/reference/pricing">Pricing</a>
            &nbsp;&mdash; pay-per-action micropayments, free tier, and cost
            tracking
          </li>
          <li>
            <a href="/docs/reference/faq">FAQ</a>
            &nbsp;&mdash; frequently asked questions about models, payments,
            privacy, and more
          </li>
        </ul>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
