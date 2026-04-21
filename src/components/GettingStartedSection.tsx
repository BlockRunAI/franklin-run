const STEPS: Array<{
  num: string;
  title: string;
  body: string;
  code: string;
}> = [
  {
    num: "01",
    title: "Install",
    body: "One npm command. Node 20+. macOS, Linux, WSL.",
    code: "npm i -g @blockrun/franklin",
  },
  {
    num: "02",
    title: "Run free",
    body: "Free NVIDIA Nemotron & Qwen3 Coder out of the box. No wallet required.",
    code: "franklin",
  },
  {
    num: "03",
    title: "Fund ($5 is plenty)",
    body: "Generate a Base or Solana wallet. Send USDC. Unlock every frontier model.",
    code: "franklin setup base",
  },
  {
    num: "04",
    title: "State an outcome",
    body: "Code, trade, research, generate — Franklin picks, pays, reports, stops.",
    code: "franklin --trust",
  },
];

const SLASH: Array<{ cmd: string; desc: string }> = [
  { cmd: "/model [name]", desc: "Interactive picker or direct switch" },
  { cmd: "/plan · /execute", desc: "Read-only planning, then run" },
  { cmd: "/ultrathink <q>", desc: "Deep reasoning for hard problems" },
  { cmd: "/compact", desc: "Structured context compression" },
  { cmd: "/search <q>", desc: "Search the codebase" },
  { cmd: "/session-search", desc: "Full-text across past sessions" },
  { cmd: "/history · /resume", desc: "Inspect or restore any session" },
  { cmd: "/commit · /push · /pr", desc: "Git workflow helpers" },
  { cmd: "/review · /fix · /test", desc: "One-shot review, bugfix, tests" },
  { cmd: "/cost · /wallet", desc: "Session spend + address + balance" },
  { cmd: "/insights [--days N]", desc: "Spend breakdowns and trends" },
  { cmd: "/learnings", desc: "What Franklin has picked up" },
];

export function GettingStartedSection() {
  return (
    <section id="get-started" className="dark-section grain-dark">
      <div className="glow" />
      <div className="top-rule" />
      <div className="inner">
        <div className="eyebrow">
          <span className="line" />
          <span className="engraved label">Pricing · Install · Fund</span>
        </div>
        <h2 className="dark-h">
          Pay for the{" "}
          <em style={{ fontStyle: "italic" }} className="shimmer">
            outcome
          </em>
          ,<br />
          nothing else.
        </h2>

        <div className="stamp-402">
          <span className="stamp-c" style={{ top: 12, left: 16 }}>◆ HTTP</span>
          <span className="stamp-c" style={{ top: 12, right: 16 }}>◆ x402</span>
          <span className="stamp-c" style={{ bottom: 12, left: 16 }}>◆ EIP-712</span>
          <span className="stamp-c" style={{ bottom: 12, right: 16 }}>◆ USDC</span>
          <div className="stamp-row">
            <span className="stamp-num">402</span>
            <div className="stamp-body">
              <div className="engraved stamp-label">You Only Pay Outcome · YOPO</div>
              <div className="stamp-title">Provider cost + 5%, signed per action.</div>
              <div className="stamp-rule" />
              <p className="stamp-p">
                No subscription (you don&rsquo;t pay for access). No pay-per-call (you
                don&rsquo;t pay for failed tries). The wallet balance is the hard cap.
                When it hits zero, Franklin stops. That&rsquo;s the whole pricing model.
              </p>
            </div>
          </div>
        </div>

        <div className="steps">
          {STEPS.map((s) => (
            <div key={s.num} className="step">
              <div className="step-num">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              <code>{s.code}</code>
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
            Install from npm
          </a>
          <a
            className="btn-outline lg"
            href="https://github.com/blockrunai/franklin"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>

        <div style={{ marginTop: 80 }}>
          <div className="eyebrow">
            <span className="line" />
            <span className="engraved label">Slash Commands · 18 built-in</span>
          </div>
          <div className="slash-wrap">
            {SLASH.map((s) => (
              <div key={s.cmd} className="slash">
                <div className="slash-cmd">{s.cmd}</div>
                <div className="slash-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bot-rule" />
    </section>
  );
}
