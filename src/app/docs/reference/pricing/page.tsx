import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
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
          Each model call costs fractions of a cent, proportional to the
          tokens consumed. The exact cost depends on the model and provider.
        </p>

        <h2>Free Tier</h2>
        <p>
          Franklin always includes free access to NVIDIA-hosted models:
        </p>
        <ul>
          <li>Llama 3.1 (8B, 70B, 405B)</li>
          <li>Mistral (7B, Mixtral)</li>
          <li>Qwen 2.5</li>
          <li>DeepSeek R1</li>
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

        <h2>Example Costs</h2>
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
