import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import {
  FaSeedling, FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock,
  FaPaperPlane, FaQuestionCircle, FaArrowRight, FaLeaf, FaHeadset
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
  visible: { transition: { staggerChildren: 0.1 } },
};

const ContactUs = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(() => ({
    name: "",
    email: "",
    subject: searchParams.get("subject") || "",
    message: "",
  }));
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactDetails = [
    {
      icon: <FaMapMarkerAlt size={18} />,
      label: "Address",
      value: "Indiranagar, Bengaluru, Karnataka 560038, India",
      href: "https://maps.google.com/?q=Indiranagar%2C+Bengaluru%2C+Karnataka+560038",
      color: "#6CC24A",
    },
    { icon: <FaEnvelope size={18} />, label: "Email", value: "support@farmisto.com", href: "mailto:support@farmisto.com", color: "#5B8EE6" },
    { icon: <FaPhone size={18} />, label: "Phone", value: "+91 80 5550 1234", href: "tel:+918055501234", color: "#E8C547" },
    { icon: <FaClock size={18} />, label: "Hours", value: "24/7", color: "#E8621A" },
  ];

  const supportOptions = [
    { icon: <FaQuestionCircle size={24} />, title: "FAQs", desc: "Browse common questions and instant answers.", link: "/faq", color: "#5B8EE6" },
    { icon: <FaHeadset size={24} />, title: "Email Support", desc: "Open an email to our support team.", link: "mailto:support@farmisto.com?subject=Farmisto%20support", external: true, color: "#6CC24A" },
    { icon: <FaLeaf size={24} />, title: "Farmer Support", desc: "Get help with your farmer account or listings.", link: "/contact?subject=Farmer%20support", color: "#E8C547" },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark via-dark/95 to-dark/90 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute top-1/3 right-1/3 w-16 h-16 rounded-full border border-orange/10" />
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/20 rounded-full text-orange text-sm font-semibold mb-6">
              <FaHeadset size={14} /> Get in Touch
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-5">
              Contact <span className="italic font-normal text-orange">Us</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Have a question, feedback, or need help? We'd love to hear from you. Our support team is available 24/7.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Contact Form - 3 cols */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-[2rem] border border-cream-dark shadow-sm p-6 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-4">
                <FaPaperPlane size={10} /> Send a Message
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-dark mb-2">We'd love to hear from you!</h2>
              <p className="text-muted text-sm mb-8">Fill out the form and we'll get back to you as soon as possible.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 text-dark placeholder-muted text-sm transition-all"
                      placeholder="Aarav Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 text-dark placeholder-muted text-sm transition-all"
                      placeholder="aarav.sharma@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 text-dark placeholder-muted text-sm transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-5 py-3.5 rounded-xl border border-cream-dark bg-cream focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 text-dark placeholder-muted text-sm transition-all resize-none"
                    placeholder="Write your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all shadow-md ${
                    submitted
                      ? "bg-green-500 text-white"
                      : "bg-orange text-white hover:bg-orange-hover hover:shadow-orange/30 hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {submitted ? (
                    <>Message Sent!</>
                  ) : (
                    <><FaPaperPlane size={14} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Details - 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Info Cards */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {contactDetails.map((detail, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-cream-dark p-5 hover:shadow-md hover:border-orange/20 transition-all duration-300 flex items-center gap-4 group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: detail.color }}>
                    {detail.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{detail.label}</p>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.href.startsWith("https://") ? "_blank" : undefined}
                        rel={detail.href.startsWith("https://") ? "noreferrer" : undefined}
                        className="text-sm font-semibold text-dark group-hover:text-orange transition-colors"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-dark">{detail.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Map Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm flex-1"
            >
              <div className="h-48 sm:h-56 bg-gradient-to-br from-cream via-cream-dark/20 to-cream flex items-center justify-center relative">
                {/* Decorative map illustration */}
                <div className="absolute inset-0">
                  <div className="absolute top-6 left-8 w-16 h-16 rounded-full bg-orange/5" />
                  <div className="absolute bottom-8 right-10 w-24 h-24 rounded-full bg-orange/5" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed border-orange/20" />
                </div>
                <div className="relative text-center">
                  <div className="w-14 h-14 rounded-full bg-orange flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FaMapMarkerAlt size={22} className="text-white" />
                  </div>
                  <p className="text-sm font-bold text-dark">Farmisto HQ</p>
                  <p className="text-xs text-muted mt-1">Indiranagar, Bengaluru, Karnataka 560038</p>
                </div>
              </div>
              <div className="p-4 border-t border-cream-dark text-center">
                <a
                  href="https://maps.google.com/?q=Indiranagar%2C+Bengaluru%2C+Karnataka+560038"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-orange hover:text-orange-hover"
                >
                  Open in Google Maps
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <section className="bg-white border-y border-cream-dark">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-4">
              <FaHeadset size={10} /> Other Ways
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-dark">More Ways to Get Help</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          >
            {supportOptions.map((option, i) => {
              const SupportLink = option.external ? "a" : Link;
              const linkProps = option.external ? { href: option.link } : { to: option.link };

              return (
                <motion.div key={i} variants={fadeUp}>
                  <SupportLink {...linkProps} className="block bg-cream rounded-2xl p-6 border border-cream-dark hover:shadow-lg hover:border-orange/20 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4" style={{ backgroundColor: option.color }}>
                    {option.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-dark mb-2 group-hover:text-orange transition-colors">{option.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{option.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-orange text-xs font-semibold mt-3 group-hover:gap-2.5 transition-all">
                    {option.external ? "Contact support" : "Learn more"} <FaArrowRight size={10} />
                  </span>
                  </SupportLink>
                </motion.div>
              );
            })}
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
            className="relative bg-gradient-to-r from-dark to-dark/90 rounded-[2rem] overflow-hidden p-8 sm:p-12 text-center"
          >
            <div className="absolute inset-0">
              <div className="absolute top-8 left-8 w-24 h-24 rounded-full border border-orange/10" />
              <div className="absolute bottom-8 right-12 w-36 h-36 rounded-full border border-orange/10" />
            </div>
            <div className="relative z-10">
              <Sparkle size={24} className="text-orange mx-auto mb-4 animate-sparkle" />
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                Join the <span className="italic text-orange">Farmisto</span> Family
              </h2>
              <p className="text-white/60 text-base max-w-md mx-auto mb-8">
                Whether you're a farmer looking to sell or a consumer seeking fresh produce — we're here for you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/market" className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-8 py-3.5 rounded-full text-base hover:bg-orange-hover transition-all duration-300 shadow-lg hover:shadow-orange/30 hover:shadow-xl hover:-translate-y-0.5">
                  Shop Now <FaArrowRight size={14} />
                </Link>
                <Link to="/faq" className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full text-base border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <FaQuestionCircle size={14} /> View FAQs
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

export default ContactUs;
