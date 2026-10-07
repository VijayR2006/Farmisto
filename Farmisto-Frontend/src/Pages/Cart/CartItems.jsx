import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaMinus, FaPlus, FaStore, FaMapMarkerAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=150&fit=crop";

const CartItems = ({ cart, deleteItem, handleQuantityChange }) => {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center bg-white rounded-2xl border border-cream-dark">
        <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center">
          <FaShoppingCart size={32} className="text-orange/30" />
        </div>
        <div>
          <p className="font-serif text-xl font-bold text-dark">Your cart is empty</p>
          <p className="text-muted text-sm mt-1">Head to the market to add fresh produce.</p>
        </div>
        <Link to="/market" className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-hover transition-colors shadow-sm">
          Browse Market
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {cart.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -80, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.03 }}
            className="w-full bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-md hover:border-orange/20 transition-all duration-200 overflow-hidden group"
          >
            <div className="flex items-center gap-4 p-4">
              {/* Image */}
              <div className="h-20 w-20 shrink-0 bg-cream rounded-xl overflow-hidden">
                <img
                  src={item.imageUrl || PLACEHOLDER}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                  alt={item.itemName || "Product"}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-base font-bold text-dark truncate">{item.itemName}</h3>

                {/* Farmer info */}
                {item.farmer && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                    <FaStore className="text-orange shrink-0" size={9} />
                    <span className="truncate">{item.farmer.name}</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="text-sm text-orange font-bold">₹{item.discountedPrice || item.itemPrice} / {item.itemUnit?.unit}</p>
                  {item.discountedPrice && item.discountedPrice !== item.itemPrice && (
                    <>
                      <span className="text-xs text-muted line-through">₹{item.itemPrice}</span>
                      {item.saving !== 0 && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                          -{item.saving}%
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Qty stepper */}
              <div className="flex items-center gap-1 shrink-0 bg-cream rounded-xl p-1">
                <motion.button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  whileTap={{ scale: 0.85 }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-cream-dark hover:border-orange hover:text-orange transition-colors text-dark shadow-sm"
                >
                  <FaMinus size={9} />
                </motion.button>
                <span className="w-8 text-center font-bold text-dark text-sm">{item.quantity}</span>
                <motion.button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  whileTap={{ scale: 0.85 }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-cream-dark hover:border-orange hover:text-orange transition-colors text-dark shadow-sm"
                >
                  <FaPlus size={9} />
                </motion.button>
              </div>

              {/* Total */}
              <div className="text-right shrink-0 w-24">
                <p className="font-bold text-dark text-base">₹{(item.discountedPrice || item.itemPrice) * item.quantity}</p>
                <p className="text-[10px] text-muted">total</p>
              </div>

              {/* Delete */}
              <motion.button
                onClick={() => deleteItem(item.id)}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
              >
                <MdDelete size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CartItems;
