import ScanBackground from "@/components/ScanBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PricingCards from "@/components/PricingCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScanBackground />
      <div className="max-w-[1080px] mx-auto px-7 relative z-10">
        <Header />
        <Hero />
        <PricingCards />
        <Footer />
      </div>
    </>
  );
}