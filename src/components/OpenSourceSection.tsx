import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

interface OpenSourceSectionProps {
  dict?: HomeDict;
}

export function OpenSourceSection({ dict = defaultDict }: OpenSourceSectionProps) {
  const o = dict.openSource;

  return (
    <section className="light grain">
      <div className="inner os-head">
        <div className="eyebrow">
          <span className="line" />
          <span className="engraved">{o.eyebrow}</span>
        </div>
        <h2 className="section-h">
          {o.titleTop}
          <br />
          <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>
            {o.titleEm}
          </em>
          .
        </h2>
      </div>
      <div className="inner">
        <div className="manifesto">
          <div className="manifesto-labels">
            {o.labels.map((l) => (
              <div key={l.k} className="ml-item">
                <div className="ml-key">{l.k}</div>
                <div className="ml-val">{l.v}</div>
              </div>
            ))}
          </div>
          <div className="manifesto-prose">
            {o.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="small">{o.smallParagraph}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
