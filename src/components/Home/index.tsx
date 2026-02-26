import React from "react";
// import NewArrival from "./NewArrivals";
// import Hero from "./Hero";
// import AboutUsSection from "./AboutUsSection";
// import BlackFridayHero from "./Hero/BlackFridayHero";
import Image from "next/image";

const Home = () => {
  return (
    <main className="min-h-screen bg-[#f9fafb]">
      {/* Homepage content commented out - showing popup event images only */}
      {/* <BlackFridayHero /> */}
      {/* <Hero /> */}
      {/* <NewArrival /> */}
      {/* <AboutUsSection /> */}

      <div className="w-full min-h-screen flex flex-col gap-6">
        <div className="relative w-full max-w-full">
          <Image
            src="/popup-event-1.jpeg"
            alt="Popup Event 1"
            width={1170}
            height={780}
            className="w-full h-auto"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative w-full max-w-full">
          <Image
            src="/popup-event-2.jpeg"
            alt="Popup Event 2"
            width={1170}
            height={780}
            className="w-full h-auto"
            sizes="100vw"
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
