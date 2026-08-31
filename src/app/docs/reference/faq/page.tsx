import type { Metadata } from "next";
import { DocsContent } from "@/components/docs/DocsContent";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import { DocsBreadcrumb } from "@/components/docs/DocsBreadcrumb";
import { DocsPagination } from "@/components/docs/DocsPagination";
import { getBreadcrumbs, getPageNavigation } from "@/lib/docs-navigation";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/reference/faq" },
  title: "FAQ",
  description: "Frequently asked questions about models, payments, privacy, and more.",
};

const PAGE_PATH = "/docs/reference/faq";

export default function FaqPage() {
  const breadcrumbs = getBreadcrumbs(PAGE_PATH);
  const { prev, next } = getPageNavigation(PAGE_PATH);

  return (
    <>
      <DocsBreadcrumb items={breadcrumbs} />

      <DocsContent
        title="FAQ"
        description="Frequently asked questions about models, payments, privacy, and more."
      >
        <h2>What models does Franklin support?</h2>
        <p>
          Franklin supports <strong>70+ models</strong> from 15+ providers,
          including OpenAI (GPT-5.6 Sol, GPT-5.5, GPT-5.3 Codex, o3), Anthropic
          (Claude Opus 5, Sonnet 5, Haiku 4.5), Google (Gemini 3.1 Pro, Gemini
          3.6 Flash), xAI (Grok 4.5, Grok Imagine), DeepSeek (V4 Pro, V4
          Flash), Moonshot (Kimi K3), Qwen (Qwen3.7 Max), MiniMax (M3), Z.AI
          (GLM-5.3), and a free tier hosted by NVIDIA, Cohere and Poolside. Run{" "}
          <code>franklin models</code> to see the full list with pricing.
        </p>

        <h2>How does payment work?</h2>
        <p>
          Franklin uses the <strong>x402 protocol</strong> for micropayments.
          Each API call is settled instantly in USDC on Base or Solana. You
          pay provider cost + 5%, settled via EIP-712 signatures. No
          subscriptions, no invoices, no billing cycles &mdash; you pay only
          for what you use.
        </p>
        <CodeBlock language="bash">
          {`# Set up a wallet
franklin setup base

# Check your balance
franklin balance`}
        </CodeBlock>

        <h2>Is my data private?</h2>
        <p>
          Yes. <strong>Everything is stored locally</strong> in{" "}
          <code>~/.blockrun/</code> on your machine. Session history,
          learnings, brain memory, wallet keys, and configuration never leave
          your computer. API calls go directly to model providers &mdash;
          Franklin does not proxy your prompts through any intermediary.
        </p>

        <Callout type="info" title="No telemetry">
          Franklin does not collect telemetry, usage analytics, or crash
          reports. Your data stays on your machine.
        </Callout>

        <h2>Can I use it for free?</h2>
        <p>
          Yes. Franklin includes a <strong>free tier of seven models</strong>
          (Nemotron 3 Nano 30B, Nemotron 3.5 Lightning, Nemotron 3 Nano Omni,
          Nemotron 3 Ultra 550B, Llama 3.2 11B Vision, Cohere North Mini Code,
          Poolside Laguna XS 2.1) with unlimited usage and zero setup. No wallet,
          no USDC, no API keys required. Just install and run <code>franklin</code>.
        </p>
        <p>
          Fund your wallet only when you want to unlock premium models like
          Claude Opus 5, GPT-5.6 Sol, Gemini 3.1 Pro, and DeepSeek V4 Pro.
        </p>

        <h2>How is this different from Claude Code?</h2>
        <p>
          Claude Code is a coding copilot locked to a single provider
          (Anthropic). Franklin is an <strong>economic agent</strong> &mdash;
          software with purchasing power:
        </p>
        <ul>
          <li>
            Routes across <strong>70+ models</strong> from 15+ providers &mdash;
            picks the best model for each task, saving up to 89% vs always
            using Opus
          </li>
          <li>
            Uses <strong>x402 micropayments</strong> instead of $200/month
            subscriptions &mdash; provider cost + 5%, no rate limits
          </li>
          <li>
            Has <strong>self-evolution</strong> &mdash; learns your preferences
            and improves over time
          </li>
          <li>
            Works across <strong>verticals</strong> &mdash; code, trading,
            research, image generation, social media, and ops
          </li>
          <li>
            <strong>Non-custodial</strong> &mdash; your keys never leave your
            machine, everything stored locally
          </li>
        </ul>

        <h2>Can I migrate from Claude Code?</h2>
        <p>
          Yes. Franklin includes a built-in migration tool that imports your
          Claude Code settings, CLAUDE.md project instructions, and history:
        </p>
        <CodeBlock language="bash">
          {`franklin migrate`}
        </CodeBlock>
        <p>
          The migration is non-destructive &mdash; it copies data without
          modifying your existing Claude Code installation.
        </p>

        <h2>What happens if I run out of USDC?</h2>
        <p>
          Franklin automatically falls back to free NVIDIA models when your
          wallet balance is insufficient for premium models. You never lose
          access to the agent &mdash; it just routes to free models until
          you top up.
        </p>

        <h2>Can I use Franklin with my own API keys?</h2>
        <p>
          Franklin uses the x402 payment protocol by default, so you do not
          need individual API keys for each provider. However, you can
          configure direct API keys via{" "}
          <code>franklin config</code> if you prefer to use your own accounts.
        </p>

        <h2>Where can I get help?</h2>
        <ul>
          <li>
            <strong>GitHub Issues</strong> &mdash;{" "}
            <a href="https://github.com/blockrunai/franklin/issues">
              github.com/blockrunai/franklin/issues
            </a>
          </li>
          <li>
            <strong>Discord</strong> &mdash; join the BlockRun community for
            real-time help
          </li>
          <li>
            <strong>Documentation</strong> &mdash; you are here
          </li>
        </ul>
      </DocsContent>

      <DocsPagination prev={prev} next={next} />
    </>
  );
}
