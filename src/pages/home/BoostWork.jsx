/** @format */

import { motion } from "framer-motion";

import { variants3, variants4 } from "../../constant";
import card_1_img_2 from "../../../public/Hero_images/car.json";
import card_1_img_1 from "../../../public/Hero_images/flight";
import Lottie from "lottie-react";

const BoostWork = () => {
  return (
    <section className="pb-10">
      <div className="container grid lg:grid-cols-2 2xl:gap-28 lg:gap-10 gap-10 md:pt-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={variants3}
          viewport={{ once: true, amount: 0.5 }}
          className="left_content sm:mr-[-30px]">
          <Lottie animationData={card_1_img_1} loop={true} className="w-full" />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={variants4}
          viewport={{ once: true, amount: 0.5 }}
          className="right_content lg:mt-10">
          <div>
            <span className="bg-[#E5F5EF] text-[#52BD95] px-5 lg:py-4 py-3 rounded-md lg:text-[1.125em] text-[1em] font-Inter font-medium">
              Find Your Perfect Flight
            </span>
            <h3 className="lg:mt-10 mt-7">
              Book Flights with Ease & Confidence
            </h3>
            <p className="!font-normal mt-5 max-w-[500px]">
              Booking flights with us is simple, reliable, and rewarding. With
              access to over 500+ global airlines, flexible date searches, and
              real-time price alerts, you can effortlessly find the best deals
              tailored to your travel needs. We also offer a Price Match
              Guarantee, 24/7 customer support for peace of mind, and carbon
              offset options to help you travel sustainably—all while securing
              your tickets in just a few clicks.
            </p>
            <a href="" className="btn primary_btn lg:mt-10 mt-5">
              Explore Features
            </a>
          </div>
        </motion.div>
      </div>
      <div className="container grid lg:grid-cols-2 2xl:gap-28 lg:gap-10 gap-10 md:pt-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={variants3}
          viewport={{ once: true, amount: 0.3 }}
          className="left_content sm:mr-[-30px] max-lg:order-2 lg:mt-10">
          <div>
            <span className="bg-[#E5F5EF] text-[#52BD95] px-5 lg:py-4 py-3 rounded-md lg:text-[1.125em] text-[1em] font-Inter font-medium">
              Explore the World’s Hidden Gems
            </span>
            <h3 className="lg:mt-10 mt-7">
              Discover Unforgettable Sightseeing Experiences
            </h3>
            <p className="!font-normal mt-5 max-w-[500px]">
              Our sightseeing experiences stand out with handpicked tours led by
              local experts, offering skip-the-line access to save time and
              customizable itineraries to match your pace. Whether you're
              exploring cultural landmarks like the Louvre or ancient ruins,
              seeking adventure through hiking and zip-lining, or indulging in
              food tours and wine tastings, we cater to every interest. From
              iconic destinations like Paris’ Eiffel Tower and Tokyo’s Mount
              Fuji to New York’s Broadway shows, our diverse options ensure
              unforgettable adventures tailored just for you.
            </p>
            <a href="" className="btn primary_btn lg:mt-10 mt-5">
              Explore Features
            </a>
          </div>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={variants4}
          viewport={{ once: true, amount: 0.3 }}
          className="right_content max-lg:order-1">
          <Lottie animationData={card_1_img_2} loop={true} className="w-full" />
        </motion.div>
      </div>
    </section>
  );
};

export default BoostWork;
