import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GettingStartedSection } from "@/components/GettingStartedSection";
import { OpenSourceSection } from "@/components/OpenSourceSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="relative">
        <Header />
        <HeroSection />
      </div>
      <FeaturesSection />
      <GettingStartedSection />
      <OpenSourceSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
