import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SideBar = ({ isOpen, setIsSidebarOpen }) => {

  const tabs = [
    { label: "Home", path: "/" },
    { label: "MarketPlace", path: "/market" },
    { label: "Nearby Farmers", path: "/farmers" },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 w-64 sm:w-72 h-full bg-emerald-50 shadow-xl z-50 flex flex-col p-4 sm:p-6"
    >

      <h1 className="text-3xl sm:text-5xl font-black font-[Aladin] text-[#0d331c] mb-6 sm:mb-8">
        Farmisto
      </h1>


      <div className="flex flex-col gap-4 sm:gap-6">
        {tabs.map((tab, index) => (
          <Link
            to={tab.path}
            key={index}
            onClick={() => setIsSidebarOpen(false)}
            className="text-base sm:text-lg text-green-800 font-semibold hover:text-green-600 transition-colors duration-200"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <button
        className="absolute top-4 right-4 text-green-800 text-xl sm:text-2xl"
        onClick={() => setIsSidebarOpen(false)}
      >
        ✕
      </button>
    </motion.div>
  );
};

export default SideBar;