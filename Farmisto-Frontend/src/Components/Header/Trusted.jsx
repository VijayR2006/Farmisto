import React from "react";
import { FaAirbnb } from "react-icons/fa";
import { PiFramerLogoFill } from "react-icons/pi";
import { FaMountainSun } from "react-icons/fa6";
import { SiTreehouse, SiWprocket } from "react-icons/si";
import { motion } from "framer-motion";

const Trusted = () => {
  const partners = [
    { name: "Airbnb", Icon: FaAirbnb },
    { name: "Framer", Icon: PiFramerLogoFill },
    { name: "Himalayas", Icon: FaMountainSun },
    { name: "Treehouse", Icon: SiTreehouse },
    { name: "Pendo", Icon: SiWprocket },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full py-12 lg:py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <p className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-8">
          Trusted by growing businesses everywhere
        </p>
        <div className="flex flex-wrap justify-center gap-8 lg:gap-14">
          {partners.map(({ name, Icon }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-2 text-neutral-400 hover:text-green-600 transition-colors duration-300 cursor-pointer group"
            >
              <Icon size={28} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="text-lg lg:text-xl font-semibold hidden sm:inline">
                {name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Trusted;
