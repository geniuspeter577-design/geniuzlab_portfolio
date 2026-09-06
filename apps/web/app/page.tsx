import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <CTASection />
    </>
  );
}
