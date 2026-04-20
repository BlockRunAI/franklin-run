type Row = {
  label: string;
  saas: string;
  ppc: string;
  franklin: React.ReactNode;
  saasNeg?: boolean;
  ppcNeg?: boolean;
};

const ROWS: Row[] = [
  {
    label: "You pay for",
    saas: "Access, whether used or not",
    ppc: "Every attempt, including dead-ends",
    franklin: <strong>The outcome. Once.</strong>,
  },
  {
    label: "Monthly fee",
    saas: "$20 — $200",
    ppc: "$0, plus usage",
    franklin: <strong>$0. Pay only what you spend.</strong>,
  },
  {
    label: "Rate limits",
    saas: "Yes. Tightens when you need it most.",
    ppc: "Per-key quotas, tiers",
    franklin: <strong>None. Wallet balance is the only cap.</strong>,
  },
  {
    label: "Identity",
    saas: "Email + credit card",
    ppc: "Vendor account, API keys per model",
    franklin: <strong>A wallet. No email, no KYC.</strong>,
  },
  {
    label: "Model choice",
    saas: "Single vendor",
    ppc: "You juggle 12 keys",
    franklin: <strong>55+ models via one wallet · router decides.</strong>,
    saasNeg: true,
    ppcNeg: true,
  },
  {
    label: "Provider outage",
    saas: "You’re stopped.",
    ppc: "You’re stopped.",
    franklin: <strong>Routes to the next provider.</strong>,
    saasNeg: true,
    ppcNeg: true,
  },
  {
    label: "Overdraft risk",
    saas: "Silent auto-renew",
    ppc: "Unbounded bill at month end",
    franklin: <strong>None. Wallet empty ⇒ Franklin stops.</strong>,
  },
  {
    label: "Source",
    saas: "Closed",
    ppc: "Closed SDK",
    franklin: <strong>Apache 2.0 · local-first.</strong>,
    saasNeg: true,
    ppcNeg: true,
  },
];

export function CompareSection() {
  return (
    <section id="compare" className="light darker grain">
      <div className="top-rule" />
      <div className="inner">
        <div
          className="features-head"
          style={{ gridTemplateColumns: "1fr 2fr", padding: "120px 0 0" }}
        >
          <div>
            <div className="eyebrow">
              <span className="line" />
              <span className="engraved">The Ledger</span>
            </div>
            <h2 className="section-h">
              In a table,
              <br />
              to be plain.
            </h2>
          </div>
          <p className="features-intro">
            AI products sell access. Subscriptions hand you monthly guilt and rate
            limits. Pay-per-call bills you for every failed try. Franklin settles for
            the outcome — once, in USDC.
          </p>
        </div>

        <div className="compare-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th />
                <th>Subscription SaaS</th>
                <th>Pay-per-call API</th>
                <th className="franklin">Franklin — YOPO</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="label">{row.label}</td>
                  <td className={row.saasNeg ? "no" : undefined}>{row.saas}</td>
                  <td className={row.ppcNeg ? "no" : undefined}>{row.ppc}</td>
                  <td className="franklin-col">{row.franklin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bot-rule" />
    </section>
  );
}
