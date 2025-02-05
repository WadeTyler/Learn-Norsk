'use client';
import Hero from "@/components/home/Hero";
import Subhero from "@/components/home/Subhero";
import ChooseNorsk from "@/components/home/ChooseNorsk";
import DiscoverOurStory from "@/components/home/DiscoverOurStory";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background">
        <Hero />
        <Subhero />
        <ChooseNorsk />
        <DiscoverOurStory />
        <Testimonials />
        <Footer />
    </div>
  );
}
