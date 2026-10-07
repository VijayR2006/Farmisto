import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaMinus, FaPlus, FaStore } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop";

const MobileCartItems = ({ cart, deleteItem, handleQuantityChange }) => {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center bg-white rounded-2xl border border-cream-dark">
        <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center">
          <FaShoppingCart size={28} className="text-orange/30" />
        </div>
        <div>
          <p className="font-serif text-lg font-bold text-dark">Cart is empty</p>
          <p className="text-muted text-xs mt-1">Visit the market to add items.</p>
        </div>
        <Link to="/market" className="inline-flex items-center gap-2 px-5 py-2 bg-orange text-white rounded-xl text-xs font-semibold hover:bg-orange-hover transition-colors shadow-sm">
          Browse Market
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {cart.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden"
          >
            <div className="p-3.5">
              {/* Top row: image + info + delete */}
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 shrink-0 bg-cream rounded-xl overflow-hidden">
                  <img
                    src={item.imageUrl || PLACEHOLDER}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                    alt={item.itemName || "Product"}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-sm font-bold text-dark truncate">{item.itemName}</h3>
                  {item.farmer && (
                    <p className="text-[10px] text-muted flex items-center gap-1 mt-0.5">
                      <FaStore className="text-orange" size={8} /> {item.farmer.name}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-orange font-bold">₹{item.discountedPrice || item.itemPrice}/{item.itemUnit?.unit}</span>
                    {item.discountedPrice && item.discountedPrice !== item.itemPrice && (
                      <>
                        <span className="text-[10px] text-muted line-through">₹{item.itemPrice}</span>
                        {item.saving !== 0 && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1 py-0.5 rounded-full font-semibold">-{item.saving}%</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={() => deleteItem(item.id)}
                  whileTap={{ scale: 0.85 }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
                >
                  <MdDelete size={14} />
                </motion.button>
              </div>

              {/* Bottom row: qty + total */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-dark">
                <div className="flex items-center gap-1 bg-cream rounded-lg p-0.5">
                  <motion.button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    whileTap={{ scale: 0.85 }}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-cream-dark hover:border-orange hover:text-orange transition-colors"
                  >
                    <FaMinus size={8} />
                  </motion.button>
                  <span className="w-7 text-center font-bold text-dark text-xs">{item.quantity}</span>
                  <motion.button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    whileTap={{ scale: 0.85 }}
                    className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-cream-dark hover:border-orange hover:text-orange transition-colors"
                  >
                    <FaPlus size={8} />
                  </motion.button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-dark text-sm">₹{(item.discountedPrice || item.itemPrice) * item.quantity}</p>
                  <p className="text-[9px] text-muted">total</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MobileCartItems;
