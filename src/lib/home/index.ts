import { type Locale } from "@/lib/locales";
import type { HomeDict } from "./types";
import { en } from "./en";
import { zhCN } from "./zh-CN";
import { ja } from "./ja";
import { ko } from "./ko";
import { ru } from "./ru";
import { id } from "./id";
import { ar } from "./ar";
import { hi } from "./hi";
import { ur } from "./ur";
import { ptBR } from "./pt-BR";
import { vi } from "./vi";
import { tr } from "./tr";
import { fa } from "./fa";

export type { HomeDict } from "./types";
export {
  LOCALES,
  LOCALE_META,
  isRTL,
  isValidLocale,
  homeUrl,
  NON_DEFAULT_LOCALES,
  type Locale,
} from "@/lib/locales";

const dicts: Record<Locale, HomeDict> = {
  en,
  "zh-CN": zhCN,
  ja,
  ko,
  ru,
  id,
  ar,
  hi,
  ur,
  "pt-BR": ptBR,
  vi,
  tr,
  fa,
};

export function getHomeDict(locale: Locale): HomeDict {
  return dicts[locale] ?? en;
}
