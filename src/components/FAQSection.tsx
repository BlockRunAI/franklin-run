"use client";

import { useState } from "react";
import { PlusIcon } from "./icons";
import { en as defaultDict } from "@/lib/home/en";
import type { HomeDict } from "@/lib/home/types";

interface FAQSectionProps {
  dict?: HomeDict;
}

export function FAQSection({ dict = defaultDict }: FAQSectionProps) {
  const [openIdx, setOpenIdx] = useState<number>(0);
  const f = dict.faq;

  return (
    <section className="light darker grain">
      <div className="top-rule" />
      <div className="inner">
        <div className="faq-grid">
          <div className="faq-left">
            <div className="eyebrow">
              <span className="line" />
              <span className="engraved">{f.eyebrow}</span>
            </div>
            <h2 className="faq-h">
              {f.titleTop}
              <br />
              <em style={{ fontStyle: "italic", color: "var(--gold-dim)" }}>
                {f.titleEm}
              </em>
              .
            </h2>
            <p className="faq-p">{f.intro}</p>
          </div>
          <div>
            {f.items.map(({ q, a }, i) => {
              const open = openIdx === i;
              return (
                <div key={q} className={`faq-item${open ? " open" : ""}`}>
                  <button
                    type="button"
                    className="faq-btn"
                    aria-expanded={open}
                    onClick={() => setOpenIdx(open ? -1 : i)}
                  >
                    <span className="faq-num">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="faq-q">{q}</span>
                    <span className="faq-plus">
                      <PlusIcon className="h-3 w-3" />
                    </span>
                  </button>
                  <div className="faq-body">
                    <div>
                      <p>{a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
