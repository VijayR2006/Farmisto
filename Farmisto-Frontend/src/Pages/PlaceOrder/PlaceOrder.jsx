import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { SiVisa } from "react-icons/si";
import { FaShieldAlt, FaLock, FaCreditCard, FaArrowRight, FaLeaf, FaCheckCircle } from "react-icons/fa";
import assets from "../../assets/assets";

const Sparkle = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C12.3 7.8 16.2 11.7 22 12C16.2 12.3 12.3 16.2 12 22C11.7 16.2 7.8 12.3 2 12C7.8 11.7 11.7 7.8 12 2Z" />
  </svg>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [personalData, setPersonalData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", city: "", state: "", zip: "",
  });
  const [processing, setProcessing] = useState(false);

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonalInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const isCardFormValid = () =>
    cardData.number.length === 16 && cardData.expiry.length === 5 &&
    cardData.cvc.length === 3 && cardData.name.trim() !== "";

  const isPersonalFormValid = () =>
    personalData.firstName.trim() && personalData.lastName.trim() &&
    personalData.email.includes("@") && personalData.phone.trim() &&
    personalData.street.trim() && personalData.city.trim() &&
    personalData.state.trim() && personalData.zip.trim();

  const formatCardNumber = (number) =>
    number.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExpiryDate = (expiry) =>
    expiry.replace(/\s+/g, "").replace(/[^0-9]/g, "")
      .replace(/(\d{2})(\d{1,2})?/, (m, p1, p2) => (p2 ? `${p1}/${p2}` : p1))
      .slice(0, 5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isCardFormValid() || !isPersonalFormValid()) return;
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate("/order-confirmation");
    }, 2000);
  };

  const isValid = isCardFormValid() && isPersonalFormValid();

  return (
    <div className="min-h-screen w-full flex flex-col bg-cream">
      <NavBar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-dark via-dark/95 to-dark/90 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-orange/5 blur-3xl" />
        </div>
        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/20 rounded-full text-orange text-sm font-semibold mb-4">
              <FaShieldAlt size={14} /> Secure Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              Complete Your <span className="italic text-orange">Order</span>
            </h1>
            <p className="text-white/60 text-base max-w-lg mx-auto">
              Your payment information is encrypted and secure. Shop with confidence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 lg:py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Personal Details */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 sm:p-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-4">
                <FaLeaf size={10} /> Shipping Details
              </span>
              <h2 className="font-serif text-2xl font-bold text-dark mb-6">Your Details</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">First Name</label>
                    <input
                      type="text" name="firstName" value={personalData.firstName}
                      onChange={handlePersonalInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Last Name</label>
                    <input
                      type="text" name="lastName" value={personalData.lastName}
                      onChange={handlePersonalInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Email</label>
                    <input
                      type="email" name="email" value={personalData.email}
                      onChange={handlePersonalInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Phone</label>
                    <input
                      type="text" name="phone" value={personalData.phone}
                      onChange={handlePersonalInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">Street Address</label>
                  <input
                    type="text" name="street" value={personalData.street}
                    onChange={handlePersonalInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                    placeholder="123 Farm Lane"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">City</label>
                    <input
                      type="text" name="city" value={personalData.city}
                      onChange={handlePersonalInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="Greenville"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">State</label>
                    <input
                      type="text" name="state" value={personalData.state}
                      onChange={handlePersonalInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Zip</label>
                    <input
                      type="text" name="zip" value={personalData.zip}
                      onChange={handlePersonalInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>

              {/* Validation checklist */}
              <div className="mt-6 pt-4 border-t border-cream-dark">
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Name", ok: personalData.firstName && personalData.lastName },
                    { label: "Email", ok: personalData.email.includes("@") },
                    { label: "Phone", ok: personalData.phone },
                    { label: "Address", ok: personalData.street && personalData.city && personalData.state && personalData.zip },
                  ].map((item, i) => (
                    <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${item.ok ? "bg-green-100 text-green-700" : "bg-cream text-muted"}`}>
                      {item.ok ? <FaCheckCircle size={9} /> : <span className="w-2 h-2 rounded-full bg-cream-dark" />}
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-cream-dark shadow-sm p-6 sm:p-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-4">
                <FaCreditCard size={10} /> Payment
              </span>
              <h2 className="font-serif text-2xl font-bold text-dark mb-6">Card Details</h2>

              {/* Card Preview */}
              <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-xl relative bg-gradient-to-br from-dark to-dark/90 text-white p-5 mb-6">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-4 right-4 w-20 h-20 rounded-full border border-orange/20" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full border border-orange/10" />
                </div>
                {assets?.chip && (
                  <img src={assets.chip} alt="Chip" className="absolute top-5 left-4 w-10 h-10" />
                )}
                <div className="absolute top-4 right-4">
                  <SiVisa size={44} className="text-white/80" />
                </div>
                <div className="flex flex-col justify-between h-44 relative z-10">
                  <p className="text-lg tracking-[0.2em] font-mono mt-14">
                    {formatCardNumber(cardData.number) || "1234  5678  1234  5678"}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Card Holder</p>
                      <p className="text-sm uppercase font-medium truncate max-w-[140px]">
                        {cardData.name || "JOHN DOE"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Expires</p>
                      <p className="text-sm font-medium">
                        {formatExpiryDate(cardData.expiry) || "MM/YY"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Shine effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Card Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">Card Number</label>
                  <input
                    type="text" name="number" value={cardData.number}
                    onChange={handleCardInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all tracking-widest"
                    placeholder="1234 5678 1234 5678" maxLength={16}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-1.5">Card Holder Name</label>
                  <input
                    type="text" name="name" value={cardData.name}
                    onChange={handleCardInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                    placeholder="JOHN DOE"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">Expiry</label>
                    <input
                      type="text" name="expiry" value={cardData.expiry}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="MM/YY" maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">CVV</label>
                    <input
                      type="password" name="cvc" value={cardData.cvc}
                      onChange={handleCardInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                      placeholder="•••" maxLength={3}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={!isValid || processing}
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-md ${
                  isValid
                    ? "bg-orange text-white hover:bg-orange-hover shadow-orange/20"
                    : "bg-cream-dark text-muted cursor-not-allowed"
                }`}
              >
                {processing ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                ) : (
                  <><FaLock size={13} /> Pay Securely</>
                )}
              </motion.button>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-cream-dark">
                <div className="flex items-center justify-center gap-5 text-[10px] text-muted">
                  <span className="flex items-center gap-1"><FaShieldAlt size={10} className="text-green-500" /> SSL Encrypted</span>
                  <span className="flex items-center gap-1"><FaLock size={10} className="text-orange" /> Secure Payment</span>
                  <span className="flex items-center gap-1"><FaLeaf size={10} className="text-green-500" /> PCI Compliant</span>
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default PlaceOrder;
