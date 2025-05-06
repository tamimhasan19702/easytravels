/** @format */

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import BoostWork from "./BoostWork";
import Clients from "./Clients";
import Faq from "./Faq";
import Hero from "./Hero";
import FeaturedDestinations from "./FeaturedDestinations";
import Aboutus from "./Aboutus";
import HowItWorks from "./HowitWorks";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Clients />
      <BoostWork />
      <Aboutus />
      <HowItWorks />
      <FeaturedDestinations />
      <Faq />
      <Footer />
    </>
  );
};

export default Home;
