import React from "react";
import NewArrival from "./NewArrivals";
import Hero from "./Hero";
import AboutUsSection from "./AboutUsSection";

const Home = () => {
  return (
    <main>
      <Hero />
      <NewArrival />
      <AboutUsSection />
    </main>
  );
};

export default Home;
