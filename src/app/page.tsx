import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GettingStartedSection } from "@/components/GettingStartedSection";
import { CompareSection } from "@/components/CompareSection";
import { OpenSourceSection } from "@/components/OpenSourceSection";
import { BlogSection } from "@/components/BlogSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div style={{ position: "relative" }}>
        <Header />
        <HeroSection />
      </div>
      <FeaturesSection />
      <GettingStartedSection />
      <CompareSection />
      <OpenSourceSection />
      <BlogSection />
      <FAQSection />
      <Footer />
    </>
  );
}
