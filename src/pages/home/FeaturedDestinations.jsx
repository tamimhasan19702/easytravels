/** @format */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import vanice from "../../assets/images/eleni-afiontzi-mbnruiJwveU-unsplash.jpg";
import banff from "../../assets/images/john-lee-oMneOBYhJxY-unsplash.jpg";
import dubai from "../../assets/images/david-rodrigo-Fr6zexbmjmc-unsplash.jpg";

const FeaturedDestinations = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // Always moving forward

  const destinations = [
    {
      name: "Venice, Italy",
      description:
        "Glide through Venice’s canals with our hassle-free guided tours.",
      image: vanice,
      bgColor: "bg-[#6d597a]",
    },
    {
      name: "Banff, Canada",
      description:
        "Explore Banff’s stunning landscapes with effortless planning.",
      image: banff,
      bgColor: "bg-[#355070]",
    },
    {
      name: "Dubai, UAE",
      description: "Discover Dubai’s wonders with easy bookings and support.",
      image: dubai,
      bgColor: "bg-[#b56576]",
    },
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 100, damping: 20 },
        opacity: { duration: 0.5 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 100, damping: 20 },
        opacity: { duration: 0.5 },
      },
    }),
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + destinations.length) % destinations.length
    );
  };

  return (
    <section className="py-20 md:py-16">
      <div className="w-full">
        <h2 className="text-center text-3xl md:text-5xl font-bold text-[#1e293b] mb-8 md:mb-12">
          Top Destinations Made Easy
        </h2>

        <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              className={`absolute w-full h-full top-0 left-0 ${destinations[currentIndex].bgColor} flex items-center justify-center`}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={(event, info) => {
                if (info.offset.x < -100) {
                  nextSlide();
                } else if (info.offset.x > 100) {
                  prevSlide();
                }
              }}>
              <div className="relative w-full h-full">
                <img
                  className="w-full h-full object-cover"
                  src={destinations[currentIndex].image}
                  alt={destinations[currentIndex].name}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4 md:p-8">
                  <h3 className="text-[clamp(2.5rem,6vw,4rem)] font-bold text-[#f2f1fc] mb-4">
                    {destinations[currentIndex].name}
                  </h3>
                  <p className="text-base md:text-lg text-white mb-4 max-w-xl mx-auto">
                    {destinations[currentIndex].description}
                  </p>
                  <a
                    href="/explore"
                    className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white bg-[#52BD95] rounded-full hover:bg-[#51CBFF] transition-all duration-200 ease-linear">
                    Plan Your Trip
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-4 space-x-2 absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
            {destinations.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-[#52BD95]" : "bg-[#d1d5db]"
                }`}></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
