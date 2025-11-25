import React from "react";
import NewArrival from "./NewArrivals";
import Hero from "./Hero";
import AboutUsSection from "./AboutUsSection";
import BlackFridayHero from "./Hero/BlackFridayHero";

const Home = () => {
  return (
    <main>
      <BlackFridayHero />
      {/* <Hero /> */}
      <NewArrival />
      <AboutUsSection />
    </main>
  );
};

export default Home;
