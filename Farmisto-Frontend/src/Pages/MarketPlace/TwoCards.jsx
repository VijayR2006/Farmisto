import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const TwoCards = () => {
  const cards = [
    {
      label: "Vegetables",
      title: "Green World",
      offer: "Get 50% off on selected Veggies.",
      accent: "#86efac",
      btnBg: "#E8C547",
      img: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=700&h=500&fit=crop",
    },
    {
      label: "Fresh Fruits",
      title: "Healthy Food",
      offer: "Get 40% off on selected Fruits.",
      accent: "#fca5a5",
      btnBg: "#f5f5f5",
      img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&h=500&fit=crop",
    },
  ];

  return (
    <div className="w-full bg-cream py-8 md:py-12">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to="/market"
                className="relative block rounded-2xl overflow-hidden h-56 sm:h-64 shadow-lg group"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${card.img})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-dark/10 group-hover:from-dark/85 transition-all duration-300" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6">
                  <span
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: card.accent }}
                  >
                    {card.label}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1.5">
                    {card.title}
                  </h2>
                  <p className="text-white/70 text-sm mb-4">{card.offer}</p>
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-dark text-xs w-fit transition-all duration-300 group-hover:gap-3"
                    style={{ backgroundColor: card.btnBg }}
                  >
                    Shop Now <FaArrowRight size={10} />
                  </span>
                </div>

                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TwoCards;
