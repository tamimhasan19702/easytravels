/** @format */

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import BoostWork from "./BoostWork";
import Clients from "./Clients";
import Faq from "./Faq";
import Hero from "./Hero";
import Pricing from "./Pricing";
import TimeLine from "./TimeLine";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Clients />
      <BoostWork />
      <TimeLine />
      <Pricing />
      <Faq />
      <Footer />
    </>
  );
};

export default Home;
