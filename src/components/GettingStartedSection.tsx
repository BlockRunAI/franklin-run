import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

const STEP_CODES = [
  "npm i -g @blockrun/franklin",
  "franklin",
  "franklin setup base",
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
    <section id="get-started" className="dark-section grain-dark">
      <div className="glow" />
      <div className="top-rule" />
      <div className="inner">
        <div className="eyebrow">
          <span className="line" />
          <span className="engraved label">{g.eyebrow}</span>
        </div>
        <h2 className="dark-h">
          {g.titlePre}{" "}
          <em style={{ fontStyle: "italic" }} className="shimmer">
            {g.titleEm}
          </em>
          {g.titleAfterEm}
          <br />
          {g.titlePost}
        </h2>

        <div className="stamp-402">
          <span className="stamp-c" style={{ top: 12, left: 16 }}>◆ HTTP</span>
          <span className="stamp-c" style={{ top: 12, right: 16 }}>◆ x402</span>
          <span className="stamp-c" style={{ bottom: 12, left: 16 }}>◆ EIP-712</span>
          <span className="stamp-c" style={{ bottom: 12, right: 16 }}>◆ USDC</span>
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

        <div style={{ marginTop: 80 }}>
          <div className="eyebrow">
            <span className="line" />
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
      <div className="bot-rule" />
    </section>
  );
}
