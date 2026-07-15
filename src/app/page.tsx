import { CaseStudiesSection } from "@/components/CaseStudiesSection";
import { CheckoutStorySection } from "@/components/checkout-story/CheckoutStorySection";
import { FeaturesCloudSection } from "@/components/FeaturesCloudSection";
import { FinalCtaSection } from "@/components/FinalCtaSection";
import { GoOnlineSection } from "@/components/GoOnlineSection";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { MarketingSection } from "@/components/MarketingSection";
import { MotionReady } from "@/components/MotionReady";
import { PressStrip } from "@/components/PressStrip";
import { ProductDashboard } from "@/components/ProductDashboard";
import { ProductTypesSection } from "@/components/ProductTypesSection";
import { PortfolioDisclaimer } from "@/components/PortfolioDisclaimer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SpecimenHero } from "@/components/SpecimenHero";
import { TestimonialsStrip } from "@/components/TestimonialsStrip";
import { TrustStrip } from "@/components/TrustStrip";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export default function Home() {
  return (
    <MotionReady>
      <SiteHeader />
      <PortfolioDisclaimer />
      <main>

        <SpecimenHero />
        <TrustStrip />
        <ProductDashboard />
        <ProductTypesSection />
        <FeaturesCloudSection />
        <GoOnlineSection />
        <IntegrationsSection />
        <MarketingSection />
        <CheckoutStorySection />
        {/* mayar.id bottom: testimoni → studi kasus → diliput → final CTA → footer */}
        <TestimonialsStrip />
        <CaseStudiesSection />
        <PressStrip />
        <FinalCtaSection />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </MotionReady>
  );
}
