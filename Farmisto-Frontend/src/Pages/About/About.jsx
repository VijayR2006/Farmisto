import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import {
  FaSeedling, FaLeaf, FaHandshake, FaEye, FaHeart, FaMapMarkerAlt,
  FaArrowRight, FaStar, FaUsers, FaStore, FaTruck
} from "react-icons/fa";
import useMarketStats from "../../utils/useMarketStats";

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const About = () => {
  const { stats: marketStats, loading: statsLoading, error: statsError } = useMarketStats();
  const stats = [
    { icon: <FaUsers size={22} />, value: marketStats ? marketStats.farmerCount.toLocaleString("en-IN") : statsLoading ? "…" : "N/A", label: "Active Farmers" },
    { icon: <FaStore size={22} />, value: marketStats ? marketStats.productCount.toLocaleString("en-IN") : statsLoading ? "…" : "N/A", label: "Fresh Products" },
    { icon: <FaTruck size={22} />, value: "5km", label: "Delivery Radius" },
    { icon: <FaStar size={22} />, value: marketStats?.averageRating == null ? "N/A" : marketStats.averageRating.toFixed(1), label: "Avg Rating" },
  ];

  const sections = [
    {
      title: "Our Mission",
      badge: "Mission",
      text: "To connect consumers with farmers directly, ensuring the freshest produce while empowering local agriculture through fair trade and sustainable practices. We believe every farmer deserves fair compensation and every family deserves fresh, organic food.",
      img: "/farm.jpg",
      accent: "#6CC24A",
      reverse: false,
    },
    {
      title: "Our Vision",
      badge: "Vision",
      text: "A future where communities thrive on locally sourced, organic food while farmers gain the recognition and compensation they deserve. We envision a world where the farm-to-table journey is transparent, sustainable, and beneficial for everyone involved.",
      img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=700&h=800&fit=crop",
      accent: "#E8C547",
      reverse: true,
    },
    {
      title: "Our Story",
      badge: "Story",
      text: "Farmisto was born from a simple observation — farmers work incredibly hard but often don't get fair prices, while consumers struggle to find truly fresh produce. We built a platform that bridges this gap, creating meaningful connections between the people who grow food and the people who eat it.",
      img: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=700&h=800&fit=crop",
      accent: "#E8621A",
      reverse: false,
    },
  ];

  const values = [
    { icon: <FaSeedling size={24} />, title: "Sustainability", desc: "Protecting our planet through eco-friendly farming practices and reducing food miles.", color: "#6CC24A" },
    { icon: <FaHandshake size={24} />, title: "Fair Trade", desc: "Ensuring farmers receive the full value they deserve for their hard work.", color: "#E8C547" },
    { icon: <FaEye size={24} />, title: "Transparency", desc: "Building trust through honest communication about sourcing and pricing.", color: "#5B8EE6" },
    { icon: <FaUsers size={24} />, title: "Community", desc: "Strengthening local economies by supporting farmers in your neighborhood.", color: "#E8621A" },
    { icon: <FaHeart size={24} />, title: "Health", desc: "Promoting nutritious, chemical-free food choices for healthier families.", color: "#6CC24A" },
    { icon: <FaMapMarkerAlt size={24} />, title: "Hyperlocal", desc: "Connecting you to farms within 5km for the freshest same-day produce.", color: "#E8C547" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark via-dark/95 to-dark/90 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-orange/5" />
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/20 rounded-full text-orange text-sm font-semibold mb-6">
              <FaSeedling size={14} /> About Us
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5">
              About <span className="italic font-normal text-orange">Farmisto</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
              Revolutionizing how fresh produce reaches your table — connecting local farmers directly with your family for healthier, fairer food.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center"
                >
                  <div className="text-orange mx-auto mb-2">{stat.icon}</div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            {statsError && <p className="mt-3 text-xs text-white/50">{statsError}</p>}
          </motion.div>
        </div>
      </div>

      {/* Mission / Vision / Story */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-24 space-y-20 lg:space-y-28">
        {sections.map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`flex flex-col ${s.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-20`}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative w-full h-[320px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src={s.img}
                  referrerPolicy="no-referrer"
                  alt={s.title}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&h=800&fit=crop";
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute -bottom-4 -right-4 sm:right-6 bg-white rounded-2xl px-5 py-3 shadow-xl border border-cream-dark"
              >
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: s.accent }}>{s.badge}</span>
                <p className="text-sm font-semibold text-dark">Farmisto</p>
              </motion.div>
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ backgroundColor: `${s.accent}15`, color: s.accent }}>
                <Sparkle size={10} /> {s.badge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-6">{s.title}</h2>
              <p className="text-muted text-base sm:text-lg leading-relaxed">{s.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Values */}
      <section className="bg-white border-y border-cream-dark">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 lg:py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-4">
              <FaHeart size={10} /> What We Stand For
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-dark">Our Values</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-cream rounded-2xl p-6 border border-cream-dark hover:shadow-lg hover:border-orange/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 transition-colors" style={{ backgroundColor: v.color }}>
                  {v.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-dark mb-2 group-hover:text-orange transition-colors">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-cream py-8 lg:py-12">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-dark to-dark/90 rounded-[2rem] overflow-hidden p-8 sm:p-12 lg:p-16 text-center"
          >
            {/* Decorative */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-orange/10" />
              <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full border border-orange/10" />
            </div>
            <div className="relative z-10">
              <Sparkle size={24} className="text-orange mx-auto mb-5 animate-sparkle" />
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
                Join the <span className="italic text-orange">Revolution</span>
              </h2>
              <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-8">
                Be part of a community that values fresh, organic produce and fair trade. Together, we can make a real difference.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/market" className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-8 py-3.5 rounded-full text-base hover:bg-orange-hover transition-all duration-300 shadow-lg hover:shadow-orange/30 hover:shadow-xl hover:-translate-y-0.5">
                  Shop Now <FaArrowRight size={14} />
                </Link>
                <Link to="/farmers" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full text-base border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <FaLeaf size={14} /> Find Farmers
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
