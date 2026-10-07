import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";

const FeaturedProduct = () => {
  const navigate = useNavigate();
  const products = [
    {
      id: 1,
      image:
        "https://plus.unsplash.com/premium_photo-1664551734578-fe47fea8cab8?w=500&auto=format&fit=crop&q=60",
      name: "Tomato",
      description: "Fresh, juicy tomatoes picked at peak ripeness.",
      tag: "Popular",
    },
    {
      id: 2,
      image:
        "https://plus.unsplash.com/premium_photo-1708971732799-649f5526ad73?w=500&auto=format&fit=crop&q=60",
      name: "Capsicum",
      description: "Crisp, colorful capsicum bursting with flavor.",
      tag: "New",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1526470303-82c787d88682?w=500&auto=format&fit=crop&q=60",
      name: "Bell Pepper",
      description: "Zesty, ripe bell peppers in vibrant colors.",
      tag: "Seasonal",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1669544695328-c2a61f9382e8?w=500&auto=format&fit=crop&q=60",
      name: "Fresh Greens",
      description: "Soft, organic leafy greens for your table.",
      tag: "Organic",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-wider mb-4">
            Featured Products
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-800">
            Handpicked <span className="text-gradient">Fresh Produce</span>
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 font-medium mt-4 max-w-2xl mx-auto">
            Sourced directly from local farmers, bringing farm-to-table goodness right to your kitchen.
          </p>
        </motion.div>

        {/* Product Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              className="card-modern group cursor-pointer overflow-hidden"
              onClick={() => navigate("/market")}
            >
              <div className="relative overflow-hidden rounded-t-[1.25rem]">
                <img
                  src={product.image}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60";
                  }}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 rounded-full shadow-lg">
                    {product.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-neutral-800 group-hover:text-green-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-neutral-500 mt-1.5 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-green-700 group-hover:text-green-600 transition-all">
                  <span>View Details</span>
                  <FaArrowRightLong size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center mt-10 lg:mt-14"
        >
          <button
            onClick={() => navigate("/market")}
            className="btn-primary flex items-center gap-3"
          >
            Browse All Products
            <FaArrowRightLong size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProduct;