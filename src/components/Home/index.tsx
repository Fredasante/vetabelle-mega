import React from "react";
import Hero from "./Hero";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";

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
