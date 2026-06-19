import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";

import CommunitySection from "@/components/CommunitySection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductsSection />
      
      <CommunitySection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
