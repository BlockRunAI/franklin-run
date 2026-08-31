import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/reference/pricing" },
  title: "Pricing",
  description: "Pay-per-action micropayments, free tier, and cost tracking.",
};

const PAGE_PATH = "/docs/reference/pricing";

export default function PricingPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Pricing"
        description="Pay-per-action micropayments, free tier, and cost tracking."
      >
        <h2>Pay-Per-Action</h2>
        <p>
          Franklin uses <strong>micropayments</strong> &mdash; you pay per API
          call, settled instantly in USDC on Base or Solana via the x402
          protocol. There are no subscriptions, monthly fees, or rate limits.
        </p>
        <p>
          Your cost = provider cost + 5%. That&apos;s it. Each model call costs
          fractions of a cent, proportional to the tokens consumed.
        </p>

        <h2>Free Tier</h2>
        <p>
          Franklin always includes a free tier with unlimited usage &mdash;
          seven models, no wallet:
        </p>
        <ul>
          <li>Nemotron 3 Nano 30B (NVIDIA &mdash; the fastest free model)</li>
          <li>Nemotron 3.5 Lightning (NVIDIA, 1M context)</li>
          <li>Nemotron 3 Nano Omni (NVIDIA, vision)</li>
          <li>Nemotron 3 Ultra 550B (NVIDIA, 1M context)</li>
          <li>Llama 3.2 11B Vision (NVIDIA)</li>
          <li>Cohere North Mini Code (256K context, coding)</li>
          <li>Poolside Laguna XS 2.1 (coding)</li>
        </ul>

        <Callout type="tip" title="Zero setup required">
          Free models work immediately after install &mdash; no wallet, no
          USDC, no API keys. Run <code>franklin</code> and start working.
        </Callout>

        <h2>Smart Router Cost Optimization</h2>
        <p>
          The Smart Router automatically optimizes cost by selecting the
          cheapest model capable of handling the current task. For simple
          tasks (file reads, shell commands), it routes to free or low-cost
          models. For complex reasoning, it routes to premium models.
        </p>
        <p>
          You can override this by pinning a specific model:
        </p>
        <CodeBlock language="bash">
          {`# Use a specific model
franklin -m claude-sonnet-4-20250514

# See all available models and their cost tiers
franklin models`}
        </CodeBlock>

        <h2>Cost Tracking</h2>
        <p>
          Franklin tracks every cent spent. Use these tools to monitor your
          usage:
        </p>

        <h3>In-session</h3>
        <CodeBlock language="bash">
          {`# Inside a Franklin session
/cost`}
        </CodeBlock>
        <p>
          Shows the running cost of the current session, broken down by model.
        </p>

        <h3>From the command line</h3>
        <CodeBlock language="bash">
          {`franklin insights`}
        </CodeBlock>
        <p>
          Displays aggregated spending analytics: total cost, cost per model,
          cost per session, and trends over time.
        </p>

        <h3>Web panel</h3>
        <CodeBlock language="bash">
          {`franklin panel`}
        </CodeBlock>
        <p>
          Opens a web dashboard with charts showing spending history, model
          usage breakdown, and cost projections.
        </p>

        <h2>What $1 Gets You</h2>
        <p>
          Concrete token budgets for $1 in USDC:
        </p>
        <ul>
          <li>
            <strong>GPT-5.4</strong> &mdash; ~400K input tokens
          </li>
          <li>
            <strong>DeepSeek V4 Flash</strong> &mdash; ~5M input tokens
          </li>
          <li>
            <strong>Gemini 2.5 Flash Lite</strong> &mdash; ~10M input tokens
          </li>
          <li>
            <strong>GPT Image 1</strong> &mdash; ~50 images
          </li>
          <li>
            <strong>Exa neural search</strong> &mdash; ~40 queries
          </li>
          <li>
            <strong>NVIDIA free models</strong> &mdash; Unlimited (FREE)
          </li>
        </ul>

        <h2>Example Session Costs</h2>
        <p>
          Approximate costs for common operations (varies by model and context
          size):
        </p>
        <ul>
          <li>
            <strong>Simple question</strong> &mdash; $0.001 &ndash; $0.005
          </li>
          <li>
            <strong>File edit with tool calls</strong> &mdash; $0.005 &ndash;
            $0.02
          </li>
          <li>
            <strong>Complex multi-step task</strong> &mdash; $0.02 &ndash;
            $0.10
          </li>
          <li>
            <strong>Full coding session (30 min)</strong> &mdash; $0.10 &ndash;
            $0.50
          </li>
        </ul>

        <Callout type="info" title="No surprises">
          Franklin never spends without your knowledge. The <code>/cost</code>{" "}
          command shows your running total at any time, and you can set
          spending alerts via <code>franklin config maxSessionCost 1.00</code>.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
