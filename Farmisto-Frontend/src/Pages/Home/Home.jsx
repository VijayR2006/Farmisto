import React from "react";
import NavBar from "../../Components/NavBar/NavBar";
import HomeHeader from "../../Components/Header/HomeHeader";
import Footer from "../../Components/Footer/Footer";
import {
  MarqueeStrip,
  ProduceShowcase,
  AvocadoFeature,
  ProduceGrid,
  Testimonials,
  HowItWorks,
  Newsletter,
} from "../../Components/HomeSections/HomeSections";

const Home = () => {
  return (
    <div className="relative w-full min-h-screen bg-cream">
      <NavBar />
      <HomeHeader />
      <MarqueeStrip />
      <ProduceShowcase />
      <AvocadoFeature />
      <HowItWorks />
      <ProduceGrid />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
