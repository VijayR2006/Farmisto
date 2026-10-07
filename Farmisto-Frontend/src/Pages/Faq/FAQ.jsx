import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import {
  FaSeedling, FaChevronDown, FaLeaf, FaTruck, FaStore,
  FaShieldAlt, FaMobileAlt, FaQuestionCircle, FaArrowRight
} from "react-icons/fa";

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
  visible: { transition: { staggerChildren: 0.08 } },
};

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All", icon: <FaQuestionCircle size={14} /> },
    { id: "general", label: "General", icon: <FaSeedling size={14} /> },
    { id: "orders", label: "Orders & Delivery", icon: <FaTruck size={14} /> },
    { id: "farmers", label: "For Farmers", icon: <FaStore size={14} /> },
    { id: "account", label: "Account", icon: <FaShieldAlt size={14} /> },
  ];

  const faqs = [
    {
      question: "What is Farmisto?",
      answer: "Farmisto is a hyperlocal marketplace that connects consumers directly with farmers within a 30km radius. We ensure access to fresh, organic produce while promoting fair trade and sustainable farming practices. Our platform eliminates middlemen, so farmers earn more and you pay less.",
      category: "general",
      icon: <FaSeedling size={16} />,
    },
    {
      question: "How does the farm-to-table process work?",
      answer: "Simply browse farmers near you, explore their available produce, and add items to your cart. Farmers harvest and prepare your order fresh, and our delivery network ensures it reaches your doorstep the same day. You can track your order in real-time from farm to door.",
      category: "general",
      icon: <FaLeaf size={16} />,
    },
    {
      question: "What are the benefits for farmers?",
      answer: "Farmers get a dedicated dashboard to manage inventory, track sales, and analyze profits. They receive fair prices without middlemen taking cuts, build direct relationships with customers, and gain visibility in their local community. Registration is free and setup takes minutes.",
      category: "farmers",
      icon: <FaStore size={16} />,
    },
    {
      question: "How can I register as a farmer?",
      answer: "Click 'Register' and select your role as 'Farmer'. Fill in your farm details, location, and categories of produce you offer. Once verified (usually within 24 hours), you'll have full access to the farmer dashboard including item management, order tracking, and earnings analytics.",
      category: "farmers",
      icon: <FaStore size={16} />,
    },
    {
      question: "How is delivery handled?",
      answer: "Delivery is coordinated between buyers and local farmers through our hyperlocal network. Most deliveries within 5km are same-day. You'll receive tracking updates and estimated delivery times. Delivery fees vary by distance but are always transparent before checkout.",
      category: "orders",
      icon: <FaTruck size={16} />,
    },
    {
      question: "What is the delivery radius?",
      answer: "Farmisto operates within a 30km radius from each farmer. However, we recommend ordering from farmers within 5-10km for the freshest experience and fastest delivery. You can filter farmers by distance when browsing.",
      category: "orders",
      icon: <FaTruck size={16} />,
    },
    {
      question: "Can I return produce if I'm not satisfied?",
      answer: "Yes! We have a freshness guarantee. If produce arrives damaged or doesn't meet quality standards, report it within 24 hours through the app and we'll arrange a replacement or full refund. Customer satisfaction is our top priority.",
      category: "orders",
      icon: <FaShieldAlt size={16} />,
    },
    {
      question: "Is there a mobile app?",
      answer: "We're currently focused on delivering the best web experience, but a mobile app is in active development for both iOS and Android. Sign up for our newsletter to be the first to know when it launches!",
      category: "account",
      icon: <FaMobileAlt size={16} />,
    },
    {
      question: "How do I update my profile or payment details?",
      answer: "Navigate to Settings from your dashboard. Under Profile Settings you can update your personal information, address, and profile photo. Under Payment Settings you can manage your payment methods and view transaction history.",
      category: "account",
      icon: <FaShieldAlt size={16} />,
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use industry-standard encryption and never store your full payment details on our servers. All transactions are processed through secure payment gateways with PCI-DSS compliance.",
      category: "account",
      icon: <FaShieldAlt size={16} />,
    },
  ];

  const filteredFaqs = activeCategory === "all"
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark via-dark/95 to-dark/90 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full border border-orange/10" />
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full border border-orange/5" />
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/20 rounded-full text-orange text-sm font-semibold mb-6">
              <FaQuestionCircle size={14} /> Help Center
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5">
              Frequently Asked<br />
              <span className="italic font-normal text-orange">Questions</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
              Everything you need to know about Farmisto. Can't find what you're looking for? Reach out to our team.
            </p>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 sm:gap-12">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange">{faqs.length}</p>
                <p className="text-xs text-white/50 mt-0.5">FAQs</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-orange">4</p>
                <p className="text-xs text-white/50 mt-0.5">Categories</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold text-orange">24/7</p>
                <p className="text-xs text-white/50 mt-0.5">Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-cream-dark sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveIndex(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-orange text-white shadow-sm"
                    : "bg-cream text-muted hover:bg-orange/10 hover:text-orange"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 lg:py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          key={activeCategory}
          className="space-y-3"
        >
          {filteredFaqs.map((faq, i) => (
            <motion.div
              key={`${activeCategory}-${i}`}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-cream-dark overflow-hidden hover:shadow-md hover:border-orange/20 transition-all duration-300"
            >
              <button
                className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              >
                <span className="w-9 h-9 rounded-xl bg-orange/10 flex items-center justify-center text-orange shrink-0 group-hover:bg-orange group-hover:text-white transition-colors">
                  {faq.icon}
                </span>
                <span className="flex-1 font-serif text-base sm:text-lg font-semibold text-dark group-hover:text-orange transition-colors pr-2">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: activeIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-muted shrink-0"
                >
                  <FaChevronDown size={14} />
                </motion.span>
              </button>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-muted text-sm sm:text-base leading-relaxed border-t border-cream-dark ml-0 sm:ml-[52px] pl-0 sm:pl-0 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-16">
            <FaQuestionCircle size={48} className="text-orange/30 mx-auto mb-4" />
            <p className="font-serif text-xl font-bold text-dark mb-2">No FAQs in this category</p>
            <p className="text-muted text-sm">Try selecting a different category above.</p>
          </div>
        )}
      </div>

      {/* Quick Help Cards */}
      <section className="bg-white border-y border-cream-dark">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-dark">Need More Help?</h2>
            <p className="text-muted text-sm mt-2">Explore these resources or reach out directly.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {[
              { icon: <FaTruck size={22} />, title: "Delivery Info", desc: "Learn about our delivery zones, times, and fees.", link: "/faq", color: "#5B8EE6" },
              { icon: <FaStore size={22} />, title: "Farmer Guide", desc: "Everything farmers need to get started on Farmisto.", link: "/about", color: "#6CC24A" },
              { icon: <FaShieldAlt size={22} />, title: "Contact Support", desc: "Can't find your answer? Our team is here to help.", link: "/contact", color: "#E8C547" },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link to={card.link} className="block bg-cream rounded-2xl p-6 border border-cream-dark hover:shadow-lg hover:border-orange/20 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4" style={{ backgroundColor: card.color }}>
                    {card.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-dark mb-2 group-hover:text-orange transition-colors">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{card.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-8 lg:py-12">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-dark to-dark/90 rounded-[2rem] overflow-hidden p-8 sm:p-12 text-center"
          >
            <div className="absolute inset-0">
              <div className="absolute top-8 left-8 w-24 h-24 rounded-full border border-orange/10" />
              <div className="absolute bottom-8 right-12 w-36 h-36 rounded-full border border-orange/10" />
            </div>
            <div className="relative z-10">
              <Sparkle size={24} className="text-orange mx-auto mb-4 animate-sparkle" />
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                Still have <span className="italic text-orange">questions?</span>
              </h2>
              <p className="text-white/60 text-base max-w-md mx-auto mb-8">
                Feel free to reach out to our team for any additional information or concerns. We typically respond within 2 hours.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-8 py-3.5 rounded-full text-base hover:bg-orange-hover transition-all duration-300 shadow-lg hover:shadow-orange/30 hover:shadow-xl hover:-translate-y-0.5">
                Contact Us <FaArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQs;
