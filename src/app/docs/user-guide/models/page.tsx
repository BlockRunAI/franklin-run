import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/user-guide/models" },
  title: "Models",
  description: "70+ models from 15+ providers, including a free tier.",
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
        description="70+ models from 15+ providers, including a free tier."
      >
        <h2>Available Providers</h2>
        <p>
          Franklin gives you access to 70+ models from 15+ providers through a
          single interface. No API keys needed &mdash; everything is routed
          through BlockRun&apos;s unified gateway. You pay provider cost + 5%, settled
          instantly in USDC via x402.
        </p>
        <ul>
          <li><strong>Anthropic</strong> &mdash; Claude Opus 5 (1M context), Claude Opus 4.8, Claude Opus 4.7, Claude Sonnet 5 (1M context), Claude Sonnet 4.6, Claude Haiku 4.5, Claude Fable 5</li>
          <li><strong>OpenAI</strong> &mdash; GPT-5.6 Sol / Terra / Luna (plus Pro tiers), GPT-5.5, GPT-5.4, GPT-5.3 Codex, GPT-5.2, GPT-4.1, o1, o3</li>
          <li><strong>Google</strong> &mdash; Gemini 3.1 Pro, Gemini 3.6 Flash, Gemini 3.5 Flash, Gemini 3 Flash Preview, Gemini 2.5 Pro, Gemini 2.5 Flash, Flash Lite tiers</li>
          <li><strong>xAI</strong> &mdash; Grok 4.5, Grok 4.3, Grok Build 0.1, Grok Imagine (image + video)</li>
          <li><strong>DeepSeek</strong> &mdash; DeepSeek V4 Pro (1M context), V4 Flash (chat + reasoner), V4 Flash Vision</li>
          <li><strong>Moonshot</strong> &mdash; Kimi K3 (1M context, vision + reasoning)</li>
          <li><strong>Z.AI</strong> &mdash; GLM-5.3, GLM-5.3 Flash (vision), GLM-5.2, GLM-5.1, GLM-5, GLM-5 Turbo</li>
          <li><strong>Qwen</strong> &mdash; Qwen3.7 Max (1M context), Qwen3.7 Plus, Qwen3.8 Flash (vision), Qwen3.7 Flash</li>
          <li><strong>MiniMax</strong> &mdash; MiniMax M3, MiniMax M2.7 (1M context, reasoning)</li>
          <li><strong>Xiaomi</strong> &mdash; MiMo V2.5 (vision), MiMo V2.5 Pro</li>
          <li><strong>Tencent</strong> &mdash; Hy3 (262K context, reasoning)</li>
          <li><strong>NVIDIA, Cohere, Poolside</strong> &mdash; Nemotron 3, Llama 3.2 Vision, North Mini Code, Laguna XS (all free)</li>
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
          <li>Nemotron 3 Nano 30B (via NVIDIA &mdash; the fastest free model)</li>
          <li>Nemotron 3.5 Lightning (via NVIDIA, 1M context)</li>
          <li>Nemotron 3 Nano Omni (via NVIDIA, vision)</li>
          <li>Nemotron 3 Ultra 550B (via NVIDIA, 1M context)</li>
          <li>Llama 3.2 11B Vision (via NVIDIA)</li>
          <li>Cohere North Mini Code (256K context, coding)</li>
          <li>Poolside Laguna XS 2.1 (coding)</li>
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
/model claude-sonnet-5
/model gpt-5.6-sol
/model gemini-3.1-pro

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
