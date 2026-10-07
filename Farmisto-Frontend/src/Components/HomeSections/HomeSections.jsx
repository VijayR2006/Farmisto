import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight, FaLeaf, FaTruck, FaShieldAlt, FaSeedling, FaStar,
  FaShoppingBasket, FaHeart, FaEnvelope, FaCheckCircle, FaTag
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";

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

/* ============================================================
   Section 1 – Marquee ticker strip (color-variant pills)
   ============================================================ */
const MarqueeStrip = () => {
  const items = [
    { text: "Organic Produce", variant: "green" },
    { text: "Farm to Table", variant: "orange" },
    { text: "Local Farmers", variant: "green" },
    { text: "Zero Preservatives", variant: "orange" },
    { text: "Fresh Daily", variant: "green" },
    { text: "Sustainable", variant: "orange" },
    { text: "Hyperlocal Delivery", variant: "green" },
    { text: "100% Natural", variant: "orange" },
  ];

  const variantStyles = {
    green: "bg-white/15 text-white",
    orange: "bg-white/10 text-white/90",
  };

  return (
    <div className="w-full bg-orange py-3.5 overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap items-center gap-2">
        {[...items, ...items].map((item, i) => (
          <React.Fragment key={i}>
            <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${variantStyles[item.variant]}`}>
              {item.text}
            </span>
            <Sparkle size={10} className="text-white/40 mx-1" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   Section 2 – Trust Badges
   ============================================================ */
const TrustBadges = () => {
  const badges = [
    { icon: <FaLeaf size={22} />, title: "100% Organic", desc: "Certified organic produce" },
    { icon: <FaTruck size={22} />, title: "Fast Delivery", desc: "Same-day to your door" },
    { icon: <FaShieldAlt size={22} />, title: "Quality Assured", desc: "Verified farmers only" },
    { icon: <FaSeedling size={22} />, title: "Farm Fresh", desc: "Picked daily at source" },
  ];

  return (
    <section className="bg-white border-b border-cream-dark">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
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
    </section>
  );
};

/* ============================================================
   Section 3 – "Fruits & Veggies" showcase
   ============================================================ */
const ProduceShowcase = () => (
  <section className="bg-cream py-16 lg:py-24">
    <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      {/* Left: Image */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full lg:w-1/2 relative flex justify-center"
      >
        <div className="w-[300px] sm:w-[380px] h-[380px] sm:h-[460px] bg-[#E8C547] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&h=800&fit=crop"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&h=800&fit=crop"; }}
            alt="Fresh vegetables"
            className="w-full h-full object-cover"
          />
        </div>
        <img
          src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=200&h=200&fit=crop"
          referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop"; }}
          alt="kiwi"
          className="absolute -left-6 top-20 w-20 h-20 rounded-full object-cover shadow-2xl animate-float border-4 border-white"
        />
        <Sparkle size={22} className="absolute top-6 right-0 text-orange animate-sparkle" />

        {/* Floating small lime card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute -bottom-4 -right-2 sm:right-6 bg-white rounded-2xl p-3 shadow-xl border border-cream-dark w-28 animate-float-delayed"
        >
          <img
            src="https://images.unsplash.com/photo-1590502593747-42a996133562?w=200&h=120&fit=crop"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=120&fit=crop"; }}
            alt="lime"
            className="w-full h-14 object-cover rounded-xl mb-2"
          />
          <p className="text-[10px] font-bold text-dark">Fresh Limes</p>
          <p className="text-[9px] text-orange font-semibold">₹40/kg</p>
        </motion.div>
      </motion.div>

      {/* Right: Text */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="w-full lg:w-1/2"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-4">
          <FaSeedling size={12} /> Farm Fresh
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-dark leading-tight mb-6">
          Fruits &amp; Veggies<br />That Stay Fresh<br />
          <span className="text-orange italic font-normal">For Longer.</span>
        </h2>
        <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
          Farmisto protects fresh produce by forming a breathable layer on the surface, keeping moisture in while allowing natural freshness to shine through. Every item is picked at peak ripeness.
        </p>
        <Link to="/market" className="inline-flex items-center gap-3 bg-orange text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-orange-hover transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-orange/20 hover:-translate-y-0.5">
          Browse Products <FaArrowRight size={12} />
        </Link>
      </motion.div>
    </div>
  </section>
);

/* ============================================================
   Section 4 – "Avocados at Peak" feature banner
   ============================================================ */
const AvocadoFeature = () => (
  <section className="bg-cream py-8 lg:py-12">
    <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative bg-gradient-to-r from-[#E8C547] to-[#f0d060] rounded-[2rem] overflow-hidden p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-8"
      >
        {/* Left text */}
        <div className="w-full lg:w-1/2 relative z-10">
          <Sparkle size={20} className="text-dark/30 mb-3 animate-sparkle" />
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-5">
            Avocados At Peak<br />Ripeness <span className="italic font-normal">2–3 Days</span><br />Longer!
          </h2>
          <p className="text-dark/70 text-base leading-relaxed mb-6 max-w-sm">
            Our plant-based protection keeps avocados at that perfect ripeness longer, so they're still fresh when you're ready to enjoy them.
          </p>
          <Link to="/market" className="inline-flex items-center gap-2 bg-dark text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-dark/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Shop Avocados <FaArrowRight size={12} />
          </Link>
        </div>

        {/* Center: Avocado image with pulse */}
        <div className="absolute left-1/2 -translate-x-1/2 z-0 hidden lg:block">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
            <img
              src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=500&fit=crop"; }}
              alt="Avocado"
              className="w-56 h-56 object-cover rounded-full shadow-2xl border-8 border-white/40 relative z-10"
            />
          </div>
        </div>

        {/* "100% Natural" badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute top-6 right-6 sm:top-8 sm:right-10 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 z-20"
        >
          <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <FaLeaf size={10} className="text-white" />
          </span>
          <span className="text-xs font-bold text-dark">100% Natural</span>
        </motion.div>

        {/* Right text */}
        <div className="w-full lg:w-1/2 relative z-10 lg:pl-20 xl:pl-28">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-dark/80 text-base leading-relaxed mb-3">
              Protected avocados last longer and stay perfectly ripe, maintaining the firmness and creaminess you love.
            </p>
            <p className="text-dark/80 text-base leading-relaxed">
              Enjoy more of the avocados you love without worrying about them going bad before you get to use them.
            </p>
          </div>
        </div>

        <Sparkle size={30} className="absolute top-8 right-8 text-dark/15 animate-sparkle" />
        <Sparkle size={18} className="absolute bottom-8 left-8 text-dark/15 animate-sparkle" />
      </motion.div>
    </div>
  </section>
);

/* ============================================================
   Section 5 – Product grid
   ============================================================ */
const ProduceGrid = () => {
  const items = [
    { name: "English Cucumbers", img: "https://images.pexels.com/photos/1691180/pexels-photo-1691180.jpeg?auto=compress&cs=tinysrgb&w=600", bg: "#6CC24A", price: "₹35/kg", badge: "Organic" },
    { name: "Mango", img: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop", bg: "#E8621A", price: "₹120/kg", badge: "Seasonal" },
    { name: "Avocados", img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop", bg: "#E8C547", price: "₹80/pc", badge: "Organic" },
    { name: "Limes", img: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop", bg: "#6CC24A", price: "₹40/kg", badge: "Fresh" },
    { name: "Oranges", img: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop", bg: "#E8621A", price: "₹60/kg", badge: "Seasonal" },
  ];

  const badgeColors = {
    Organic: "bg-green-500",
    Seasonal: "bg-orange",
    Fresh: "bg-blue-500",
  };

  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-3">
              <Sparkle size={10} /> Featured
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-dark">
              Produce You Love,<br />
              <span className="italic font-normal text-orange">Protected</span> By Farmisto
            </h2>
          </div>
          <Link to="/market" className="inline-flex items-center gap-2 text-dark font-semibold text-sm hover:text-orange transition-colors shrink-0">
            View All <FaArrowRight size={12} />
          </Link>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="snap-start flex-shrink-0 w-44 sm:w-52 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: item.bg }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.img}
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop"; }}
                  alt={item.name}
                  className="w-full h-44 sm:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badge pill */}
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[10px] font-bold ${badgeColors[item.badge] || "bg-dark"}`}>
                  {item.badge}
                </span>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-white/90">{item.name}</p>
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs group-hover:bg-white/40 transition-colors">
                    <FaArrowRight size={10} />
                  </span>
                </div>
                {/* Price tag */}
                <span className="text-xs font-bold text-white/70">{item.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 6 – Customer Testimonials
   ============================================================ */
const Testimonials = () => {
  return (
    <section className="bg-dark py-16 lg:py-24">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/20 rounded-full text-orange text-xs font-semibold mb-4">
            <FaStar size={10} /> Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            What Our Customers<br />
            <span className="italic font-normal text-orange">Say About Us</span>
          </h2>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-white/70 text-sm">No reviews yet. Be the first to share your experience.</p>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 7 – How It Works
   ============================================================ */
const HowItWorks = () => {
  const steps = [
    {
      icon: <FaSeedling size={24} />,
      num: "01",
      title: "Browse & Choose",
      desc: "Explore fresh produce from verified local farmers within 30km of you.",
      color: "#6CC24A",
    },
    {
      icon: <FaShoppingBasket size={24} />,
      num: "02",
      title: "Order Fresh",
      desc: "Add items to your cart and place your order. Farmers harvest fresh for you.",
      color: "#E8C547",
    },
    {
      icon: <FaTruck size={24} />,
      num: "03",
      title: "Farm to Doorstep",
      desc: "Get same-day delivery straight from the farm to your kitchen.",
      color: "#E8621A",
    },
  ];

  return (
    <section className="bg-[#faf7f0] py-16 lg:py-24">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-4">
            <FaHeart size={10} /> Simple Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-dark">
            How It <span className="italic font-normal text-orange">Works</span>
          </h2>
          <p className="text-muted text-base mt-3 max-w-lg mx-auto">From farm to your doorstep in three simple steps.</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white rounded-2xl p-7 border border-cream-dark hover:shadow-lg hover:border-orange/20 transition-all duration-300 text-center group relative"
            >
              {/* Step number */}
              <span className="absolute top-4 right-5 font-serif text-4xl font-bold text-cream-dark/50">{step.num}</span>
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mx-auto mb-5 shadow-md" style={{ backgroundColor: step.color }}>
                {step.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-dark mb-2 group-hover:text-orange transition-colors">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================================
   Section 8 – Newsletter / CTA
   ============================================================ */
const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const benefits = [
    { icon: <FaSeedling size={16} />, text: "Seasonal picks" },
    { icon: <FaTag size={16} />, text: "Exclusive deals" },
    { icon: <FaLeaf size={16} />, text: "Farming tips" },
  ];

  return (
    <section className="bg-cream py-16 lg:py-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-br from-dark via-dark/95 to-dark/90 rounded-[2rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-orange/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange/10 blur-3xl" />
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full border border-white/5" />
          <div className="absolute bottom-10 left-16 w-16 h-16 rounded-full border border-orange/10" />
          <Sparkle size={20} className="absolute top-12 left-1/4 text-orange/20 animate-sparkle" />
          <Sparkle size={14} className="absolute bottom-16 right-1/4 text-white/10 animate-sparkle" style={{ animationDelay: "1s" }} />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/20 rounded-full text-orange text-xs font-semibold mb-5">
              <FaEnvelope size={10} /> Newsletter
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Stay Fresh with <span className="italic text-orange">Farmisto</span>
            </h2>
            <p className="text-white/60 text-base mb-8 max-w-lg mx-auto leading-relaxed">
              Join 12,000+ food lovers getting weekly updates on seasonal produce, exclusive deals, and farm-to-table tips.
            </p>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto mb-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-center gap-3 py-4 bg-green-500/20 border border-green-500/30 rounded-2xl"
                  >
                    <FaCheckCircle size={20} className="text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">You're subscribed! Check your inbox.</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <div className="relative flex-1">
                      <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full pl-11 pr-5 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/20 transition-all"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-6 sm:px-8 py-4 bg-orange text-white rounded-2xl font-semibold text-sm hover:bg-orange-hover transition-colors shadow-lg shadow-orange/20 shrink-0 flex items-center gap-2"
                    >
                      <span className="hidden sm:inline">Subscribe</span>
                      <FaArrowRight size={12} className="sm:hidden" />
                      <FaArrowRight size={10} className="hidden sm:inline" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {benefits.map((b, i) => (
                <span key={i} className="flex items-center gap-2 text-white/50 text-xs">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-orange">
                    {b.icon}
                  </span>
                  {b.text}
                </span>
              ))}
              <span className="flex items-center gap-2 text-white/40 text-xs">
                <FaShieldAlt size={12} className="text-green-400" />
                No spam, ever
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { MarqueeStrip, TrustBadges, ProduceShowcase, AvocadoFeature, ProduceGrid, Testimonials, HowItWorks, Newsletter };
