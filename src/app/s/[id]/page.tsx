import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getShare } from "@/lib/share-store";
import { MessageContent } from "@/components/try/MessageContent";

// Public, read-only render of a shared conversation (the "copy link" target).
// No auth, no chrome — just the snapshot, with a CTA back to Franklin.

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const convo = await getShare(id);
  if (!convo) return { title: "Shared chat · Franklin" };
  const first = convo.messages.find((m) => m.role === "user")?.content ?? "";
  const desc = first.slice(0, 140);
  return {
    title: `${convo.title} · Franklin`,
    description: desc,
    openGraph: { title: convo.title, description: desc },
    robots: { index: false }, // shares are unlisted, not indexable
  };
}

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const convo = await getShare(id);
  if (!convo) notFound();

  return (
    <div className="try-share-page">
      <header className="try-share-page-head">
        <Link href="/try" className="try-share-page-brand">Franklin</Link>
        <span className="try-share-page-tag">Shared conversation</span>
      </header>

      <main className="try-share-page-thread">
        {convo.messages.map((m, i) =>
          m.kind === "tools" ? (
            <div key={i} className="try-share-tools">
              <div className="try-share-tools-head">
                Used {m.tools?.length ?? 0} {(m.tools?.length ?? 0) === 1 ? "tool" : "tools"}
              </div>
              {(m.tools ?? []).map((s, k) => (
                <div key={k} className="try-share-tools-row">
                  <span className="try-share-tools-label">{s.label}</span>
                  {s.detail ? <span className="try-share-tools-detail">{s.detail}</span> : null}
                </div>
              ))}
            </div>
          ) : (
          <div key={i} className={`try-msg try-msg-${m.role}`}>
            <div className="try-msg-role">{m.role === "user" ? "You" : "Franklin"}</div>
            {m.kind === "image" && m.image ? (
              <div className="try-msg-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.image} alt={m.content} loading="lazy" />
              </div>
            ) : m.kind === "video" || m.kind === "music" ? (
              <div className="try-msg-body try-share-page-omitted">[media omitted from share]</div>
            ) : m.content ? (
              <div className="try-msg-body">
                {m.role === "assistant" ? <MessageContent content={m.content} /> : m.content}
              </div>
            ) : null}
          </div>
          ),
        )}
      </main>

      <footer className="try-share-page-foot">
        <Link href="/try" className="try-share-page-cta">Try Franklin — the AI agent with a wallet →</Link>
      </footer>
    </div>
  );
}
