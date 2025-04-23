/** @format */

import { motion } from "framer-motion";
import { PiArrowRightFill } from "react-icons/pi";
import { variants1 } from "../../constant";
import HeroImg2 from "/Hero_images/img-2.png";

const Hero = () => {
  return (
    <section
      className="bg_1 lg:pt-[200px] pt-[100px] mb-28 relative h-[80vh] lg:h-[100vh] overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.5)), url(${HeroImg2})`,
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}>
      <div className="container flex flex-col items-center relative z-30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={variants1}
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-center gap-5 relative z-50 lg:mb-[-60px] mb-10">
          <h1 className="text-center capitalize xl:max-w-[870px] lg:max-w-[750px] sm:max-w-[500px] max-w-[350px] mt-[80px] md:mt-0">
            Embark on a Journey of Discovery
          </h1>
          <p className="text_regular text-center leading-relaxed xl:max-w-[700px] md:max-w-[500px] max-w-[450px]">
            Travel far and wide with ease and delight. Let every adventure
            inspire your soul, as the world unfolds its wonders before you.
            Explore, dream, and create memories that last a lifetime.
          </p>
          <a
            href=""
            className="btn primary_btn !text-[0.75em] tracking-[1px] flex items-center gap-3 !pr-3 !rounded-[10px] mt-3 !py-2">
            GET STARTED
            <button className="size-[44px] flex items-center justify-center bg-white text-[#52BD95] leading-none rounded-[10px]">
              <PiArrowRightFill size={15} />
            </button>
          </a>
        </motion.div>
      </div>

      <div className="size-[272px] bg-[#52AABD] absolute top-[-20px] left-[0px] blur-[200px] z-10"></div>
      <div className="size-[272px] bg-[#52BD95] absolute top-[250px] right-[0px] blur-[200px] z-10"></div>
    </section>
  );
};

export default Hero;
