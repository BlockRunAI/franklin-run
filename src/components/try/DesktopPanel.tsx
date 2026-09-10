"use client";
import { Blocks, Download, Monitor, Terminal, Users } from "lucide-react";
import { useTryLang } from "@/lib/try-i18n";
import { ACCOUNT_COPY } from "@/lib/account-i18n";
export function DesktopPanel() {
  const { lang } = useTryLang();
  const L = ACCOUNT_COPY[lang];
  return <div className="try-tools-panel"><div className="try-tools-inner">
    <div className="try-cli-badge"><Monitor size={18} />{L.desktop}</div>
    <h2 className="try-tools-h">{L.desktopTitle}</h2><p className="try-tools-sub">{L.desktopSub}</p>
    <a className="btn-primary" href="https://github.com/BlockRunAI/Franklin/releases" target="_blank" rel="noreferrer"><Download size={18} />{L.download}</a>
    <div className="try-desktop-features">{[
      { title: L.studio, description: L.studioSub, Icon: Blocks },
      { title: L.team, description: L.teamSub, Icon: Users },
      { title: L.local, description: L.localSub, Icon: Terminal },
    ].map(({ title, description, Icon }) => <article key={title}><Icon size={22} /><h3>{title}</h3><p>{description}</p></article>)}</div>
  </div></div>;
}
