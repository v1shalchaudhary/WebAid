import ScanBackground from "@/components/ScanBackground";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VitalsList from "@/components/VitalsList";
import IssueLog from "@/components/IssueLog";
import FixPanel from "@/components/FixPanel";
import PricingCards from "@/components/PricingCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScanBackground />
      <div className="max-w-[1080px] mx-auto px-7 relative z-10">
        <Header />
        <Hero />
        <VitalsList />
        <IssueLog />
        <FixPanel />
        <PricingCards />
        <Footer />
      </div>
    </>
  );
}
