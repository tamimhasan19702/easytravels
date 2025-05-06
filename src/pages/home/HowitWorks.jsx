/** @format */

import { motion } from "framer-motion";
import howitw from "../../assets/howitw.json";
import Lottie from "lottie-react";

const HowItWorks = () => {
  // Animation variants for timeline items
  const timelineItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.2, // Staggered animation for each item
      },
    }),
  };

  // Data for the steps
  const steps = [
    {
      number: 1,
      title: "Pick Your Destination",
      description:
        "Browse our curated destinations and find your perfect getaway.",
    },
    {
      number: 2,
      title: "Book in Minutes",
      description: "Choose a package and book instantly—no complicated forms.",
    },
    {
      number: 3,
      title: "Enjoy Your Trip",
      description: "Travel worry-free with our support, from start to finish.",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left Side: Headline and Timeline */}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="md:w-1/2 w-full max-w-md mx-auto mb-12">
          <Lottie animationData={howitw} loop={true} className="w-full" />
        </motion.div>

        {/* Right Side: Lottie Animation */}
        <div className="md:w-1/2 w-full">
          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
            className="text-center text-4xl md:text-5xl font-bold text-[#1e293b] mb-12">
            Travel in 3 Easy Steps
          </motion.h2>

          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line for Timeline */}
            <div className="absolute left-0  md:left-1/2 transform -translate-x-1/2 w-1 bg-[#52BD95] h-full"></div>

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={timelineItemVariants}
                viewport={{ once: true, amount: 0.5 }}
                className={`flex items-center mb-12 flex-row ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : "md:flex-row"
                }`}>
                {/* Text Block */}
                <div
                  className={`w-1/2 px-4 text-left md:px-0 ${
                    index % 2 === 0
                      ? "md:pr-8 md:text-right"
                      : "md:pl-8 md:text-left"
                  }`}>
                  <h3 className="text-2xl font-semibold text-[#1e293b] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[#475569]">{step.description}</p>
                </div>

                {/* Step Icon */}
                <div className="w-12 h-12 bg-[#52BD95] rounded-full flex items-center justify-center text-white text-xl font-bold z-10">
                  {step.number}
                </div>

                {/* Spacer for desktop only */}
                <div className="w-0 md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
