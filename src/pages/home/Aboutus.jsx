/** @format */

import { motion } from "framer-motion";

const Aboutus = () => {
  // Define animation variants directly in the component
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-[#f8fafc] py-16">
      <div className="container mx-auto px-4">
        {/* Headline */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center text-4xl md:text-5xl font-bold text-[#1e293b] mb-4">
          Travel Made Simple with EasyTravels
        </motion.h2>

        {/* Subheadline */}
        <motion.h3
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center text-xl md:text-2xl text-[#64748b] mb-8">
          Your go-to platform for effortless travel adventures.
        </motion.h3>

        {/* Description */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-[#475569] leading-relaxed">
            At EasyTravels, we’re all about making travel as simple as a few
            clicks. Our platform helps you plan, book, and enjoy your trips with
            ease, offering curated destinations and hassle-free packages.
            Whether you’re dreaming of a beach escape, a cultural journey, or an
            adventure in the mountains, we take care of the details—flights,
            hotels, activities, and more—so you can focus on the joy of travel.
            With EasyTravels, you get seamless bookings, affordable options, and
            24/7 support every step of the way.
          </p>
        </motion.div>

        {/* Call to Action Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true, amount: 0.5 }}
          className="mt-10 text-center">
          <a
            href="/explore"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-[#52BD95] rounded-full hover:bg-[#51CBFF] transition-all duration-200 ease-linear">
            Start Planning Your Trip
            <span className="ml-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Aboutus;
