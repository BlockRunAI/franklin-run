"use client";

import { useEffect } from "react";

interface HtmlLangSyncProps {
  lang: string;
  dir?: "ltr" | "rtl";
}

export function HtmlLangSync({ lang, dir = "ltr" }: HtmlLangSyncProps) {
  useEffect(() => {
    const previousLang = document.documentElement.lang;
    const previousDir = document.documentElement.dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    return () => {
      document.documentElement.lang = previousLang;
      document.documentElement.dir = previousDir;
    };
  }, [lang, dir]);
  return null;
}
