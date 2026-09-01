import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <CategoryShowcase />
      <CTASection />
    </>
  );
}
