import React from 'react';
import Hero from "@/components/about/Hero";
import Subhero from "@/components/about/Subhero";
import Testimonial from "@/components/about/Testimonial";
import VisionAndMission from "@/components/about/VisionAndMission";
import Footer from "@/components/home/Footer";

const Page = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Hero />
      <Subhero />
      <Testimonial />
      <VisionAndMission />
      <Footer />
    </div>
  );
};

export default Page;