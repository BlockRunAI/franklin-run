import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Smart Router",
  description: "How Franklin picks the best model for every request — routing in <1ms with 7-layer compression.",
};

const PAGE_PATH = "/docs/user-guide/smart-router";

export default function SmartRouterPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Smart Router"
        description="How Franklin picks the best model for every request — routing in <1ms with 7-layer compression."
      >
        <h2>How Classification Works</h2>
        <p>
          Every time you send a message, the Smart Router classifies your
          request and picks the best model in under 1ms &mdash; 100% local,
          zero latency overhead. It analyzes prompt complexity, required
          capabilities (code, reasoning, creativity, trading), and your active
          routing profile. Before routing, 7-layer prompt compression reduces
          token count by 15-40%, cutting costs before they hit the provider.
        </p>

        <h2>Complexity Tiers</h2>
        <p>
          The router classifies requests into four tiers, each mapped to a
          different class of model:
        </p>
        <ul>
          <li>
            <strong>SIMPLE</strong> &mdash; quick facts, greetings, formatting.
            Routed to fast, cheap models.
          </li>
          <li>
            <strong>MEDIUM</strong> &mdash; summarization, code edits, general
            Q&amp;A. Routed to mid-tier models.
          </li>
          <li>
            <strong>COMPLEX</strong> &mdash; multi-step code generation,
            analysis, long-form writing. Routed to frontier models.
          </li>
          <li>
            <strong>REASONING</strong> &mdash; math proofs, deep debugging,
            architectural design. Routed to reasoning-optimized models.
          </li>
        </ul>

        <h2>Routing Profiles</h2>
        <p>
          Switch between four profiles to control the quality-cost tradeoff:
        </p>
        <ul>
          <li>
            <strong>auto</strong> &mdash; best quality-to-cost ratio (default).
            Picks the optimal model for each tier.
          </li>
          <li>
            <strong>eco</strong> &mdash; cheapest option at every tier.
            Great for high-volume, cost-sensitive work.
          </li>
          <li>
            <strong>premium</strong> &mdash; most capable model at every tier.
            Use when quality matters more than cost.
          </li>
          <li>
            <strong>free</strong> &mdash; NVIDIA models only. No wallet
            required &mdash; always available.
          </li>
        </ul>
        <CodeBlock language="bash">
          {`# Switch routing profiles
/model auto       # balanced (default)
/model eco        # cheapest
/model premium    # most capable
/model free       # NVIDIA only, no cost`}
        </CodeBlock>

        <Callout type="tip" title="Profile vs. specific model">
          You can also bypass the router entirely by setting a specific model
          with <code>/model claude-sonnet-4.6</code> or{" "}
          <code>/model gpt-5</code>. The router is only active when a profile
          is selected.
        </Callout>

        <h2>Tracking Spend</h2>
        <p>
          Use <code>/cost</code> to see a per-model spend breakdown for the
          current session:
        </p>
        <CodeBlock language="bash">
          {`/cost`}
        </CodeBlock>
        <p>
          This shows total tokens used, cost per model, and which routing
          tier each request was classified into.
        </p>

        <h2>Adaptive Learning</h2>
        <p>
          The router learns from your usage patterns over time. If you
          consistently override the router&apos;s choice for certain types of
          prompts, it adapts future routing decisions to match your
          preferences. This happens automatically &mdash; no configuration
          needed.
        </p>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
