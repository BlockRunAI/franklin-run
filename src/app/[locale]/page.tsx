import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import {
  getHomeDict,
  homeUrl,
  NON_DEFAULT_LOCALES,
  isValidLocale,
} from "@/lib/home";
import { LOCALE_META, LOCALES, type Locale } from "@/lib/blog";

const SITE_URL = "https://franklin.run";

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale) || locale === "en") return {};

  const dict = getHomeDict(locale);
  const meta = LOCALE_META[locale];

  // Build hreflang alternates pointing at every published locale homepage,
  // including the canonical English root.
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[LOCALE_META[l].htmlLang] = `${SITE_URL}${homeUrl(l)}`;
  }
  languages["x-default"] = `${SITE_URL}${homeUrl("en")}`;

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: homeUrl(locale),
      languages,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${homeUrl(locale)}`,
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      siteName: "Franklin",
      locale: meta.htmlLang,
    },
    twitter: {
      card: "summary_large_image",
      site: "@BlockRunAI",
      creator: "@BlockRunAI",
      title: dict.meta.twitterTitle,
      description: dict.meta.twitterDescription,
    },
  };
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // English lives at the root "/" — don't double-publish it under "/en".
  if (!isValidLocale(locale) || locale === "en") notFound();
  return (
    <HomePage dict={getHomeDict(locale as Locale)} locale={locale as Locale} />
  );
}
