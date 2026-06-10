import React from "react";
import NewArrival from "./NewArrivals";
import Hero from "./Hero";
import AboutUsSection from "./AboutUsSection";
import MasterclassPromo from "./MasterclassPromo";
import ThankYouPromo from "./ThankYouPromo";
// import BlackFridayHero from "./Hero/BlackFridayHero";

const Home = () => {
  return (
    <main>
      {/* <BlackFridayHero /> */}
      <ThankYouPromo />
      <MasterclassPromo />

      <Hero />
      <NewArrival />
      <AboutUsSection />
    </main>
  );
};

export default Home;
