import React from "react";
import { motion } from "framer-motion";
import { FaArrowDownLong } from "react-icons/fa6";

const MarketHeader = () => {
  return (
    <div className="w-full bg-cream py-16 lg:py-24">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <p className="text-orange font-bold tracking-widest uppercase text-sm mb-4">Fresh Marketplace</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-dark leading-tight mb-6">
            Organic,<br />
            <span className="italic font-normal">Sustainable,</span><br />
            and Fresh.
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-md mb-10">
            Browse produce sourced directly from trusted local farmers. Every item is picked fresh, guaranteed natural.
          </p>
          <a href="#products" className="inline-flex items-center gap-3 bg-dark text-white font-semibold px-7 py-4 rounded-full hover:bg-orange transition-colors duration-300 group shadow-lg">
            Browse Products
            <span className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
              <FaArrowDownLong size={14} />
            </span>
          </a>
        </div>

        {/* Right: Multi-image collage */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
          <div className="relative w-[340px] sm:w-[400px] h-[400px]">
            {/* Main large image */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 w-[80%] h-[80%] rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop" alt="Fresh vegetables" className="w-full h-full object-cover" />
            </motion.div>

            {/* Badge card on image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute bottom-0 right-0 bg-[#E8C547] rounded-2xl p-5 w-[55%] shadow-xl"
            >
              <img src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=200&fit=crop" alt="Produce" className="w-full h-28 object-cover rounded-xl mb-3" />
              <p className="text-xs font-bold text-dark uppercase tracking-widest">100% Natural</p>
              <p className="text-sm font-semibold text-dark/70">Nutrient-Rich Vegetables</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketHeader;