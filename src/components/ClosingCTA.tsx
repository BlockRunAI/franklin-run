import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

interface ClosingCTAProps {
  dict?: HomeDict;
}

export function ClosingCTA({ dict = defaultDict }: ClosingCTAProps) {
  const c = dict.closing;

  return (
    <section className="closing-cta">
      <div className="inner">
        <div className="logo-name">{c.kicker}</div>
        <h2>
          {c.titleTop}
          <br />
          <em>{c.titleEm}</em>
        </h2>
        <a className="btn-primary lg" href="#get-started">
          {c.cta}
        </a>
      </div>
    </section>
  );
}
