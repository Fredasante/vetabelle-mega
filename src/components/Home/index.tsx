import React from "react";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import Hero from "./Hero";

const Home = () => {
  return (
    <main>
      <Hero />
      <NewArrival />
      <PromoBanner />
    </main>
  );
};

export default Home;
