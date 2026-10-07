import React from "react";
import { motion } from "framer-motion";

const Story = () => {
  return (
    <section className="section-padding bg-section-gradient">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative w-full lg:w-2/5 flex justify-center"
        >
          <div className="relative w-full max-w-[340px] h-[380px] lg:h-[450px]">
            <div className="absolute -inset-3 bg-gradient-to-br from-green-300/30 to-emerald-200/30 rounded-[2rem] blur-2xl" />
            <img
              style={{
                borderTopLeftRadius: "50%",
                borderTopRightRadius: "10%",
                borderBottomRightRadius: "50%",
                borderBottomLeftRadius: "10%",
              }}
              src="https://images.pexels.com/photos/1094544/pexels-photo-1094544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop";
              }}
              className="relative h-full w-full object-cover shadow-2xl"
              alt="Fresh vegetables in a basket"
            />
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute top-[50%] -right-6 glass rounded-2xl px-5 py-3 shadow-xl animate-float"
            >
              <p className="text-lg font-bold text-gradient">Since 2001</p>
              <p className="text-xs text-neutral-500">Trusted Platform</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-wider mb-4">
            Our Story
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-800 leading-tight">
            Bridging the Gap Between
            <span className="text-gradient"> Farms & Families</span>
          </h2>
          <p className="text-base lg:text-lg text-neutral-600 font-medium leading-relaxed mt-6 max-w-2xl">
            At Farmisto, we're redefining the farm-to-table journey by eliminating
            intermediaries. Our platform connects consumers with farmers within a
            5-kilometer radius, ensuring access to fresh, locally grown produce at
            fair prices. For retailers, we provide a space to connect and
            negotiate directly with farmers, fostering transparency and better
            deals.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="/about" className="btn-primary text-sm sm:text-base">
              Learn More
            </a>
            <a href="/farmer/register" className="btn-outline text-sm sm:text-base">
              Join as Farmer
            </a>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-4 mt-10 w-full max-w-md">
            {[
              { icon: "🌱", label: "100% Organic" },
              { icon: "🤝", label: "Direct Trade" },
              { icon: "📍", label: "Hyperlocal" },
              { icon: "💰", label: "Fair Pricing" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-green-100">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-semibold text-neutral-700">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Story;