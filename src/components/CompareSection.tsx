import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

/** Rows where the saas/ppc cells should render with the .no (struck-through) class. */
const NEGATIVE_ROW_INDICES = new Set<number>([4, 5, 7]);

interface CompareSectionProps {
  dict?: HomeDict;
}

export function CompareSection({ dict = defaultDict }: CompareSectionProps) {
  const c = dict.compare;

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
              <span className="engraved">{c.eyebrow}</span>
            </div>
            <h2 className="section-h">
              {c.titleTop}
              <br />
              {c.titleBottom}
            </h2>
          </div>
          <p className="features-intro">{c.intro}</p>
        </div>

        <div className="compare-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th />
                <th>{c.headers.saas}</th>
                <th>{c.headers.ppc}</th>
                <th className="franklin">{c.headers.franklin}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row, i) => {
                const negative = NEGATIVE_ROW_INDICES.has(i);
                return (
                  <tr key={row.label}>
                    <td className="label">{row.label}</td>
                    <td className={negative ? "no" : undefined}>{row.saas}</td>
                    <td className={negative ? "no" : undefined}>{row.ppc}</td>
                    <td className="franklin-col">
                      <strong>{row.franklin}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bot-rule" />
    </section>
  );
}
