const LABELS: Array<{ k: string; v: string }> = [
  { k: "Your data", v: "~/.blockrun/" },
  { k: "Your wallet", v: "Private keys · local" },
  { k: "Your models", v: "55+ · switch in 1 cmd" },
  { k: "Your license", v: "Apache 2.0" },
  { k: "Your uptime", v: "Fork it. Self-host." },
];

export function OpenSourceSection() {
  return (
    <section className="light grain">
      <div className="inner os-head">
        <div className="eyebrow">
          <span className="line" />
          <span className="engraved">The Commons · Apache 2.0</span>
        </div>
        <h2 className="section-h">
          You own
          <br />
          <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>everything</em>.
        </h2>
      </div>
      <div className="inner">
        <div className="manifesto">
          <div className="manifesto-labels">
            {LABELS.map((l) => (
              <div key={l.k} className="ml-item">
                <div className="ml-key">{l.k}</div>
                <div className="ml-val">{l.v}</div>
              </div>
            ))}
          </div>
          <div className="manifesto-prose">
            <p>
              With closed AI tools, the vendor owns your usage data, your preferences,
              your history. They change terms — <em>you accept</em>. They raise prices —{" "}
              <em>you pay</em>. They go down — <em>you stop</em>.
            </p>
            <p>
              Franklin is Apache 2.0 and runs on your machine. Wallet keys, session
              history, learnings — everything sits in <em>~/.blockrun/</em>. Zero
              telemetry. Nothing phones home.
            </p>
            <p>
              If BlockRun disappears tomorrow, your USDC stays in your wallet and your
              agent still runs. <em>That&rsquo;s the point.</em>
            </p>
            <p className="small">
              Read every line: the entire agent loop, the 16 built-in tools, the plugin
              SDK, the x402 client, the router — it&rsquo;s all in the repo. Audit it,
              fork it, ship your own vertical.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
