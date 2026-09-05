import Link from "next/link";
import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

const STEP_CODES = [
  "npm i -g @blockrun/franklin",
  "franklin",
  "franklin setup solana",
  "franklin --trust",
];

const SLASH_CMDS = [
  "/model [name]",
  "/plan · /execute",
  "/ultrathink <q>",
  "/compact",
  "/search <q>",
  "/session-search",
  "/history · /resume",
  "/commit · /push · /pr",
  "/review · /fix · /test",
  "/cost · /wallet",
  "/insights [--days N]",
  "/learnings",
];

interface GettingStartedSectionProps {
  dict?: HomeDict;
}

export function GettingStartedSection({
  dict = defaultDict,
}: GettingStartedSectionProps) {
  const g = dict.getStarted;

  return (
    <section id="get-started" className="dark-section">
      <div className="inner">
        <div className="eyebrow">
          <span className="engraved label">{g.eyebrow}</span>
        </div>
        <h2 className="dark-h">
          {g.titlePre} <em>{g.titleEm}</em>
          {g.titleAfterEm}
          <br />
          {g.titlePost}
        </h2>

        <div className="col-span-full my-8 rounded-lg border p-8">
          <h3 className="text-xl">{dict.account.title}</h3>
          <p className="mt-3 text-sm leading-relaxed">{dict.account.body}</p>
          <div className="cta-row flex-wrap">
            <a className="btn-primary" href="https://user.blockrun.ai">{dict.account.register}</a>
            <a className="btn-outline" href="https://user.blockrun.ai/dashboard/keys">{dict.account.keys}</a>
            <a className="btn-outline" href="https://user.blockrun.ai/dashboard/credits">{dict.account.credits}</a>
            <Link className="btn-outline" href="/docs/getting-started/account-api">{dict.account.guide}</Link>
          </div>
        </div>

        <div className="stamp-402">
          <span className="stamp-c stamp-c-tl">◆ HTTP</span>
          <span className="stamp-c stamp-c-tr">◆ x402</span>
          <span className="stamp-c stamp-c-bl">◆ EIP-712</span>
          <span className="stamp-c stamp-c-br">◆ USDC</span>
          <div className="stamp-row">
            <span className="stamp-num">402</span>
            <div className="stamp-body">
              <div className="engraved stamp-label">{g.yopoLabel}</div>
              <div className="stamp-title">{g.yopoTitle}</div>
              <div className="stamp-rule" />
              <p className="stamp-p">{g.yopoBody}</p>
            </div>
          </div>
        </div>

        <div className="steps">
          {g.steps.map((s, i) => (
            <div key={i} className="step">
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              <code>{STEP_CODES[i]}</code>
            </div>
          ))}
        </div>

        <div className="cta-row">
          <a
            className="btn-primary lg"
            href="https://www.npmjs.com/package/@blockrun/franklin"
            target="_blank"
            rel="noreferrer"
          >
            {g.ctaInstall}
          </a>
          <a
            className="btn-outline lg"
            href="https://github.com/blockrunai/franklin"
            target="_blank"
            rel="noreferrer"
          >
            {g.ctaGitHub}
          </a>
        </div>

        <div className="slash-section">
          <div className="eyebrow">
            <span className="engraved label">{g.slashEyebrow}</span>
          </div>
          <div className="slash-wrap">
            {SLASH_CMDS.map((cmd, i) => (
              <div key={cmd} className="slash">
                <div className="slash-cmd">{cmd}</div>
                <div className="slash-desc">{g.slashDescs[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
