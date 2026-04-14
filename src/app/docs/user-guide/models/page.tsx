import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  title: "Models",
  description: "55+ models from 12+ providers, including a free tier.",
};

const PAGE_PATH = "/docs/user-guide/models";

export default function ModelsPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="Models"
        description="55+ models from 12+ providers, including a free tier."
      >
        <h2>Available Providers</h2>
        <p>
          Franklin gives you access to 55+ models from 12+ providers through a
          single interface. No API keys needed &mdash; everything is routed
          through BlockRun&apos;s unified gateway. You pay provider cost + 5%, settled
          instantly in USDC via x402.
        </p>
        <ul>
          <li><strong>Anthropic</strong> &mdash; Claude Opus 4.6, Claude Opus 4.5, Claude Sonnet 4.6, Claude Haiku 4.5</li>
          <li><strong>OpenAI</strong> &mdash; GPT-5.4, GPT-5.4 Pro, GPT-5.3, o1, o3, GPT-5-mini, GPT-5-nano</li>
          <li><strong>Google</strong> &mdash; Gemini 3.1 Pro, Gemini 3 Flash Preview, Gemini 2.5 Pro, Gemini 2.5 Flash</li>
          <li><strong>xAI</strong> &mdash; Grok-3, Grok-3 Fast</li>
          <li><strong>DeepSeek</strong> &mdash; DeepSeek Chat V3.2, DeepSeek Reasoner</li>
          <li><strong>Z.AI</strong> &mdash; GLM-5, GLM-5 Turbo</li>
          <li><strong>Moonshot</strong> &mdash; Kimi K2.5 (262K context, MoE)</li>
          <li><strong>MiniMax</strong> &mdash; MiniMax M2.7 (204K context, reasoning)</li>
          <li><strong>NVIDIA</strong> &mdash; GPT-OSS 120B/20B, Nemotron, Llama, Qwen (free)</li>
        </ul>

        <h2>List All Models</h2>
        <p>
          See the full list of available models and their current status:
        </p>
        <CodeBlock language="bash">
          {`franklin models`}
        </CodeBlock>
        <p>
          The output shows each model&apos;s name, provider, tier, and cost per
          million tokens.
        </p>

        <h2>Free Tier</h2>
        <p>
          The following models are always free &mdash; no wallet, no USDC, no
          sign-up:
        </p>
        <ul>
          <li>NVIDIA Nemotron</li>
          <li>Llama 3.3 70B (via NVIDIA)</li>
          <li>Qwen 2.5 (via NVIDIA)</li>
          <li>DeepSeek R1 (via NVIDIA)</li>
        </ul>
        <CodeBlock language="bash">
          {`# Use free models only
/model free`}
        </CodeBlock>

        <Callout type="tip" title="Free models are capable">
          The free NVIDIA models are surprisingly strong for most coding tasks.
          Try them before spending credits &mdash; they may be all you need.
        </Callout>

        <h2>Switching Models</h2>
        <p>
          Switch to a specific model mid-conversation with the{" "}
          <code>/model</code> command:
        </p>
        <CodeBlock language="bash">
          {`# Switch to a specific model
/model claude-sonnet-4.6
/model gpt-5
/model gemini-2.5-pro

# Switch to a routing profile
/model auto
/model free`}
        </CodeBlock>
        <p>
          Model changes take effect immediately on the next message.
        </p>

        <h2>Prompt Caching</h2>
        <p>
          Anthropic models (Claude) support prompt caching, which reduces cost
          by approximately 75% for repeated context. This is enabled
          automatically &mdash; long conversations and system prompts are cached
          and reused across messages.
        </p>

        <Callout type="info" title="Caching is automatic">
          You don&apos;t need to configure anything. Franklin detects cacheable
          content and sends the appropriate cache headers to Anthropic&apos;s
          API automatically.
        </Callout>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
