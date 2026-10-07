import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaLeaf, FaStar, FaQuoteLeft } from "react-icons/fa";
import useMarketStats from "../../utils/useMarketStats";

const Sparkle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

/* Counter hook */
const useCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const numTarget = parseInt(target);
    if (isNaN(numTarget)) { setCount(target); return; }
    const suffix = target.replace(/[0-9]/g, "");
    let start = 0;
    const increment = numTarget / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numTarget) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start) + suffix);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
};

const ProductCard = ({ bg, image, label, rotate, zIndex, translateX = 0, translateY = 0, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotate: rotate - 5 }}
    animate={{ opacity: 1, y: 0, rotate }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
    className="absolute w-[160px] sm:w-[190px] h-[220px] sm:h-[255px] rounded-3xl overflow-hidden shadow-xl cursor-pointer"
    style={{
      backgroundColor: bg,
      transform: `translateX(${translateX}px) translateY(${translateY}px)`,
      zIndex,
    }}
  >
    <img src={image} alt={label} className="w-full h-[75%] object-cover" />
    <div className="px-3 pb-3 pt-2 flex items-center justify-between">
      <span className="text-dark font-semibold text-xs">{label}</span>
      <span className="w-6 h-6 rounded-full bg-dark/10 flex items-center justify-center text-dark text-xs group-hover:bg-orange group-hover:text-white transition-colors">
        <FaArrowRight size={10} />
      </span>
    </div>
  </motion.div>
);

const HomeHeader = () => {
  const { stats: marketStats, loading: statsLoading } = useMarketStats();
  const stat1 = useCounter(marketStats ? String(marketStats.farmerCount) : statsLoading ? "…" : "N/A");
  const stat2 = useCounter(marketStats ? String(marketStats.productCount) : statsLoading ? "…" : "N/A");
  const stat3 = useCounter("100%");

  const cards = [
    {
      bg: "#E8C547",
      image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=300&fit=crop",
      label: "Avocado Mix",
      rotate: -10,
      zIndex: 10,
      translateX: -30,
      translateY: 60,
    },
    {
      bg: "#5B8EE6",
      image: "https://images.unsplash.com/photo-1669544695328-c2a61f9382e8?w=400&h=300&fit=crop",
      label: "Greens Bundle",
      rotate: 4,
      zIndex: 20,
      translateX: 20,
      translateY: -10,
    },
    {
      bg: "#6CC24A",
      image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop",
      label: "Kiwi Fresh",
      rotate: -3,
      zIndex: 30,
      translateX: 70,
      translateY: 55,
    },
  ];

  return (
    <section className="w-full overflow-hidden relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-[#f8f2e4] to-cream" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-orange/3 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-[#E8C547]/5 blur-3xl" />

      <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        {/* LEFT: Text content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start gap-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkle size={22} className="text-orange animate-sparkle mb-[-16px]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[1.0] text-dark"
          >
            Fresh<br />
            <span className="italic font-normal text-dark/80">When You&apos;re</span><br />
            <span className="text-orange">Ready.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted text-base sm:text-lg leading-relaxed max-w-sm"
          >
            Farm-fresh produce delivered to your doorstep. Adorn your meals with the finest local fruits and vegetables.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/market"
              className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-7 py-3.5 rounded-full text-base hover:bg-orange-hover transition-all duration-300 shadow-md hover:shadow-orange/30 hover:shadow-xl hover:-translate-y-0.5"
            >
              Shop Now <FaArrowRight size={14} />
            </Link>
            <Link
              to="/farmers"
              className="inline-flex items-center gap-2 bg-white text-dark font-semibold px-7 py-3.5 rounded-full text-base border border-cream-dark hover:border-orange hover:text-orange transition-all duration-300"
            >
              <FaLeaf size={14} /> Find Farmers
            </Link>
          </motion.div>

          {/* Stats row with counter animation */}
          <motion.div
            ref={stat1.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-8 mt-2"
          >
            <div>
              <p className="text-2xl font-bold text-dark">{stat1.count}</p>
              <p className="text-xs text-muted">Local Farmers</p>
            </div>
            <div className="w-px bg-cream-dark" />
            <div>
              <p className="text-2xl font-bold text-dark">{stat2.count}</p>
              <p className="text-xs text-muted">Fresh Products</p>
            </div>
            <div className="w-px bg-cream-dark" />
            <div>
              <p className="text-2xl font-bold text-dark">{stat3.count}</p>
              <p className="text-xs text-muted">Organic</p>
            </div>
          </motion.div>

          {/* Testimonial card with quote icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-cream-dark max-w-xs relative"
          >
            <FaQuoteLeft size={16} className="text-orange/20 absolute top-3 right-4" />
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={12} className="text-[#E8C547]" />
              ))}
            </div>
            <p className="text-sm text-dark leading-relaxed line-clamp-3">
              &quot;Amazing quality produce! The vegetables were incredibly fresh and delivered right on time. Highly recommend Farmisto!&quot;
            </p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-cream-dark">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
                alt="Jane Cooper"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-dark">Jane Cooper</p>
                <p className="text-xs text-muted">Verified Buyer</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Stacked product cards */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
          <div className="relative w-[300px] sm:w-[360px] h-[380px] sm:h-[440px]">
            {cards.map((card, i) => (
              <ProductCard key={i} {...card} delay={0.2 + i * 0.15} />
            ))}

            {/* Floating kiwi */}
            <motion.img
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              src="https://images.unsplash.com/photo-1585059895524-72359e06133a?w=200&h=200&fit=crop"
              alt="kiwi"
              className="absolute -left-16 top-12 w-24 h-24 rounded-full object-cover shadow-2xl animate-float border-4 border-white"
            />

            <Sparkle size={26} className="absolute top-0 right-0 text-orange animate-sparkle" />
            <Sparkle size={16} className="absolute bottom-12 right-4 text-[#E8C547] animate-sparkle opacity-70" />

            {/* Farm-fresh guarantee badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="absolute top-2 -left-4 sm:-left-8 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 border border-cream-dark z-40"
            >
              <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <FaLeaf size={10} className="text-white" />
              </span>
              <span className="text-xs font-semibold text-dark">Farm-fresh guarantee</span>
            </motion.div>

            {/* Counter pill */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute bottom-4 -right-4 bg-white rounded-full px-5 py-2 shadow-lg flex items-center gap-3 border border-cream-dark z-40"
            >
              <span className="w-7 h-7 rounded-full bg-orange flex items-center justify-center text-white text-xs font-bold">01</span>
              <div className="w-px h-5 bg-cream-dark" />
              <span className="text-sm font-semibold text-dark tracking-wide">of 14</span>
              <button className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center text-dark hover:bg-orange hover:text-white transition-colors">
                <FaArrowRight size={10} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeader;
