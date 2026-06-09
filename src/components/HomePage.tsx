import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustBar } from "@/components/TrustBar";
import { TerminalSection } from "@/components/TerminalSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GettingStartedSection } from "@/components/GettingStartedSection";
import { CompareSection } from "@/components/CompareSection";
import { OpenSourceSection } from "@/components/OpenSourceSection";
import { BlogSection } from "@/components/BlogSection";
import { FAQSection } from "@/components/FAQSection";
import { ClosingCTA } from "@/components/ClosingCTA";
import { Footer } from "@/components/Footer";
import { Guilloche } from "@/components/Guilloche";
import { HtmlLangSync } from "@/components/blog/HtmlLangSync";
import { isRTL, LOCALE_META, type Locale } from "@/lib/locales";
import type { HomeDict } from "@/lib/home/types";

interface HomePageProps {
  dict: HomeDict;
  locale: Locale;
}

/** Gold engraved divider recurring between major light sections. */
function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <div className="guilloche-rule">
        <Guilloche variant="wave" />
      </div>
    </div>
  );
}

/**
 * Shared homepage composition. Rendered by both `/` (English) and `/[locale]`
 * (every other locale). Each section reads from `dict`; the locale flips
 * <html lang> + dir on mount via HtmlLangSync.
 */
export function HomePage({ dict, locale }: HomePageProps) {
  return (
    <>
      {locale !== "en" ? (
        <HtmlLangSync
          lang={LOCALE_META[locale].htmlLang}
          dir={isRTL(locale) ? "rtl" : "ltr"}
        />
      ) : null}
      <div className="home-hero-frame">
        <Header dict={dict} locale={locale} />
        <HeroSection dict={dict} />
      </div>
      <TrustBar dict={dict} />
      <TerminalSection dict={dict} />
      <FeaturesSection dict={dict} />
      <SectionDivider />
      <GettingStartedSection dict={dict} />
      <CompareSection dict={dict} />
      <OpenSourceSection dict={dict} />
      <BlogSection dict={dict} locale={locale} />
      <SectionDivider />
      <FAQSection dict={dict} />
      <ClosingCTA dict={dict} />
      <Footer dict={dict} locale={locale} />
    </>
  );
}
