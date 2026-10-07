import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import TwoCards from "./TwoCards";
import BuyBlock from "./BuyBlock";
import { motion } from "framer-motion";
import { FaArrowDown, FaLeaf, FaTruck, FaSeedling, FaSearch } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import useMarketStats from "../../utils/useMarketStats";

const MarketPlace = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");
  const { stats, loading: statsLoading, error: statsError } = useMarketStats();

  const handleCategoryClick = (category) => {
    navigate(`/market?category=${encodeURIComponent(category)}#products-section`);
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/market?search=${encodeURIComponent(heroSearch.trim())}`);
      document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const categories = [
    { name: "Vegetables", icon: "🥬", color: "bg-green-100 text-green-700", hoverColor: "hover:bg-green-200" },
    { name: "Fruits", icon: "🍎", color: "bg-red-100 text-red-700", hoverColor: "hover:bg-red-200" },
    { name: "Nuts", icon: "🥜", color: "bg-amber-100 text-amber-700", hoverColor: "hover:bg-amber-200" },
    { name: "Dairy", icon: "🥛", color: "bg-blue-100 text-blue-700", hoverColor: "hover:bg-blue-200" },
    { name: "Spices", icon: "🌶️", color: "bg-orange-100 text-orange-700", hoverColor: "hover:bg-orange-200" },
    { name: "Pulses", icon: "🫘", color: "bg-yellow-100 text-yellow-700", hoverColor: "hover:bg-yellow-200" },
  ];

  const trustBadges = [
    { icon: <FaLeaf size={20} />, title: "100% Fresh", desc: "Farm-to-table daily" },
    { icon: <FaTruck size={20} />, title: "Fast Delivery", desc: "Same-day available" },
    { icon: <BsShieldCheck size={20} />, title: "Quality Assured", desc: "Verified farmers" },
    { icon: <FaSeedling size={20} />, title: "Organic Options", desc: "Chemical-free produce" },
  ];

  return (
    <div className="w-full bg-cream">
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark via-dark/95 to-dark/90 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-orange/5" />
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/20 rounded-full text-orange text-sm font-semibold mb-6">
                <FaSeedling size={14} /> Farmisto Market
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
                Fresh from<br />
                <span className="italic font-normal text-orange">Local Farms</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed max-w-lg mb-8">
                Discover organic, sustainable produce directly from trusted farmers near you. Every item picked fresh, guaranteed natural.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleHeroSearch} className="flex gap-3 max-w-lg mx-auto lg:mx-0 mb-10">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search vegetables, fruits, spices..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange focus:bg-white/15 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-orange text-white rounded-xl font-semibold text-sm hover:bg-orange-hover transition-colors shadow-lg shrink-0"
                >
                  Search
                </button>
              </form>

              {/* Scroll indicator */}
              <a href="#products" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-orange transition-colors">
                <FaArrowDown className="animate-bounce" size={12} />
                Browse all products
              </a>
            </motion.div>

            {/* Right: Image collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full lg:w-1/2 relative flex justify-center"
            >
              <div className="relative w-[320px] sm:w-[380px] h-[360px]">
                {/* Main image */}
                <div className="absolute inset-0 w-[75%] h-[75%] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop"
                    alt="Fresh vegetables"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlapping card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute bottom-0 right-0 bg-[#E8C547] rounded-2xl p-4 w-[55%] shadow-xl"
                >
                  <img
                    src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=200&fit=crop"
                    alt="Produce"
                    className="w-full h-24 object-cover rounded-xl mb-2"
                  />
                  <p className="text-[10px] font-bold text-dark uppercase tracking-widest">100% Natural</p>
                  <p className="text-xs font-semibold text-dark/70">Farm Fresh Daily</p>
                </motion.div>

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="absolute top-4 right-4 bg-white rounded-xl p-3 shadow-lg"
                >
                  <p className="text-2xl font-bold text-orange">
                    {stats ? stats.farmerCount.toLocaleString("en-IN") : statsLoading ? "…" : "N/A"}
                  </p>
                  <p className="text-[10px] text-muted font-medium">Local Farmers</p>
                  {statsError && <p className="text-[9px] text-muted mt-1">{statsError}</p>}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white border-b border-cream-dark">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">{badge.title}</p>
                  <p className="text-xs text-muted">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Quick Links */}
      <div id="products" className="bg-cream py-10">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Shop by Category</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full ${cat.color} ${cat.hoverColor} text-sm font-semibold whitespace-nowrap transition-all hover:scale-105`}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Promotional Cards */}
      <TwoCards />

      {/* Products Section */}
      <div id="products-section">
        <BuyBlock />
      </div>

      <Footer />
    </div>
  );
};

export default MarketPlace;
