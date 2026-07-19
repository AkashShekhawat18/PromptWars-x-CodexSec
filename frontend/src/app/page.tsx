import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white selection:bg-white/30 overflow-x-hidden">
      <Navbar />
      <Hero />
      <BentoGrid />
      <Footer />
    </main>
  );
}
