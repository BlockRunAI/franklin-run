"use client";

import { Fragment, useState } from "react";
import { Copy, Check, Maximize2, X } from "lucide-react";

// Lightweight Markdown renderer for assistant replies (no external deps):
// splits fenced ``` code blocks out, renders the rest with minimal inline
// markdown (headings, lists, bold, inline code). Code blocks get a header
// with copy + expand (fullscreen) controls.

interface Segment {
  type: "code" | "text";
  text: string;
  lang?: string;
}

function parse(md: string): Segment[] {
  const segs: Segment[] = [];
  const re = /```([\w+-]*)\n?([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    if (m.index > last) segs.push({ type: "text", text: md.slice(last, m.index) });
    segs.push({ type: "code", lang: m[1] || "", text: m[2].replace(/\n$/, "") });
    last = re.lastIndex;
  }
  if (last < md.length) segs.push({ type: "text", text: md.slice(last) });
  return segs;
}

// Inline markdown for one line: **bold** and `code`.
function renderInline(line: string, key: string) {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) nodes.push(line.slice(last, m.index));
    if (m[2] !== undefined) nodes.push(<strong key={`${key}-b${i}`}>{m[2]}</strong>);
    else if (m[3] !== undefined) nodes.push(<code key={`${key}-c${i}`} className="try-inline-code">{m[3]}</code>);
    last = re.lastIndex;
    i++;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let list: React.ReactNode[] = [];
  const flushList = (k: string) => {
    if (list.length) {
      out.push(<ul key={`ul-${k}`} className="try-md-ul">{list}</ul>);
      list = [];
    }
  };
  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    const li = /^\s*[-*]\s+(.*)$/.exec(line);
    if (li) {
      list.push(<li key={`li-${idx}`}>{renderInline(li[1], `li-${idx}`)}</li>);
      return;
    }
    flushList(String(idx));
    if (h) {
      const lvl = h[1].length;
      out.push(
        <p key={`h-${idx}`} className={`try-md-h try-md-h${lvl}`}>
          {renderInline(h[2], `h-${idx}`)}
        </p>,
      );
    } else if (line === "") {
      out.push(<div key={`sp-${idx}`} className="try-md-gap" />);
    } else {
      out.push(<p key={`p-${idx}`} className="try-md-p">{renderInline(line, `p-${idx}`)}</p>);
    }
  });
  flushList("end");
  return <>{out}</>;
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const block = (
    <div className={`try-code${expanded ? " is-expanded" : ""}`}>
      <div className="try-code-head">
        <span className="try-code-lang">{lang || "code"}</span>
        <div className="try-code-actions">
          <button onClick={copy} aria-label="Copy code">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={() => setExpanded((e) => !e)} aria-label="Expand code">
            {expanded ? <X className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <pre className="try-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );

  if (expanded) {
    return (
      <div className="try-code-overlay" onClick={() => setExpanded(false)}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: "min(900px, 92vw)" }}>
          {block}
        </div>
      </div>
    );
  }
  return block;
}

export function MessageContent({ content }: { content: string }) {
  const segs = parse(content);
  return (
    <div className="try-md">
      {segs.map((s, i) =>
        s.type === "code" ? (
          <CodeBlock key={i} lang={s.lang || ""} code={s.text} />
        ) : (
          <Fragment key={i}>
            <TextBlock text={s.text} />
          </Fragment>
        ),
      )}
    </div>
  );
}
