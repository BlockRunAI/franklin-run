type Post = {
  num: string;
  cat: string;
  date: string;
  read: string;
  title: string;
  body: string;
  href: string;
  author?: string;
  lead?: boolean;
};

const POSTS: Post[] = [
  {
    num: "№ 01",
    cat: "Thesis",
    date: "Apr 20, 2026",
    read: "8 min",
    title: "Why every AI agent will eventually hold a wallet.",
    body: "Subscriptions mispricing compute. API keys tying identity to vendors. Rate limits firing at the worst moment. The fix isn't a better dashboard — it's giving the agent the keys to its own bank account, and a hard balance it cannot exceed.",
    href: "https://github.com/blockrunai/franklin/blob/main/docs/why-ai-agents-need-a-wallet.md",
    author: "Ben · BlockRun",
    lead: true,
  },
  {
    num: "№ 02",
    cat: "Thesis",
    date: "Apr 18, 2026",
    read: "6 min",
    title: "Subscription AI is dead.",
    body: "Three pressures — autonomy, vendor concentration, accountability — are converging on the flat-rate model. None of them resolve inside it.",
    href: "https://github.com/blockrunai/franklin/blob/main/docs/subscription-ai-is-dead.md",
  },
  {
    num: "№ 03",
    cat: "Engineering",
    date: "Apr 16, 2026",
    read: "12 min",
    title: "Anatomy of an economic agent.",
    body: "A walk-through of Franklin's internals — router, x402, brain, Telegram — shown on a single user prompt end-to-end.",
    href: "https://github.com/blockrunai/franklin/blob/main/docs/anatomy-of-an-economic-agent.md",
  },
  {
    num: "№ 04",
    cat: "Field Notes",
    date: "Apr 14, 2026",
    read: "10 min",
    title: "I gave Franklin $100 and asked it to launch a product.",
    body: "One terminal, one wallet, one week. Research brief, blog post, hero image, short video — all out of the same hundred dollars.",
    href: "https://github.com/blockrunai/franklin/blob/main/docs/i-gave-franklin-100-dollars.md",
  },
  {
    num: "№ 05",
    cat: "Protocol",
    date: "Apr 10, 2026",
    read: "9 min",
    title: "The plugin SDK — ship your own vertical.",
    body: "Franklin is plugin-first. Trading, social, content — all live behind the same SDK. Here's the contract, the discovery path, and how to ship one in a weekend.",
    href: "https://github.com/blockrunai/franklin/blob/main/docs/plugin-sdk.md",
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="light grain">
      <div className="top-rule" />
      <div className="inner">
        <div className="blog-head">
          <div>
            <div className="eyebrow">
              <span className="line" />
              <span className="engraved">Dispatches</span>
            </div>
            <h2 className="section-h">
              From the
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>bench</em>.
            </h2>
          </div>
          <div className="right">
            <p className="intro">
              Notes on economic agents, x402, model routing, and what we learn from 2M+
              real requests flowing through the BlockRun gateway.
            </p>
            <a
              className="blog-all"
              href="https://github.com/blockrunai/franklin/tree/main/docs"
              target="_blank"
              rel="noreferrer"
            >
              All posts →
            </a>
          </div>
        </div>

        <div className="blog-grid">
          {POSTS.map((p) => (
            <a
              key={p.num}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className={`post${p.lead ? " lead" : ""}`}
            >
              <div className="post-meta">
                <span className="cat">{p.cat}</span>
                <span className="dot" />
                <span>{p.date}</span>
                {p.lead ? (
                  <>
                    <span className="dot" />
                    <span>{p.read}</span>
                  </>
                ) : null}
              </div>
              <div className="post-num">{p.num}</div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
              <div className="post-foot">
                <span>{p.lead ? p.author : p.read}</span>
                <span className="read">Read</span>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="bot-rule" />
    </section>
  );
}
