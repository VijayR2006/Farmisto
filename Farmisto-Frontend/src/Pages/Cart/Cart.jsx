import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import { useAuth } from "../../utils/Auth";
import { useCart } from "../../utils/CartContext";
import axios from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaTrash, FaChevronRight, FaTag, FaTruck, FaShieldAlt, FaLeaf } from "react-icons/fa";
import CartItems from "./CartItems";
import MobileCartItems from "./MobileCartItems";

const Cart = () => {
  const { authToken, userDetails, isAuthenticated } = useAuth();
  const { refreshCartCount } = useCart();
  const [cart, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [shippingCost] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState(null);
  const [confirmData, setConfirmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearConfirm, setClearConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails && authToken) fetchCart();
    else setLoading(false);
  }, [userDetails, authToken]);

  const handleConfirmation = () => navigate("/order-confirmation", { state: { data: { confirmData, shippingCost: 10 } } });

  const fetchCart = async (dsnt) => {
    const id = userDetails?.id;
    if (!authToken) { setLoading(false); return; }
    setLoading(true);
    try {
      const response = await axios.post(`/cart/user`, { id, dsnt }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200 && response.data.cart) {
        setCart(response.data.cart);
        setConfirmData(response.data);
        setTotalCost(response.data.grandTotal);
      }
    } catch (error) { console.error("Error fetching cart data:", error); }
    finally { setLoading(false); refreshCartCount(); }
  };

  const updateItem = async (itemId, newQuantity) => {
    if (!authToken) return;
    try {
      const response = await axios.patch(`/cart/update/${itemId}`, { updatedQuantity: newQuantity }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) fetchCart();
    } catch (error) { console.error("Error updating cart:", error); }
  };

  const handleQuantityChange = (itemId, value) => {
    setCart(prev => {
      const updated = prev.map(item => item.id === itemId ? { ...item, quantity: Math.max(item.quantity + value, 1) } : item);
      const updatedItem = updated.find(i => i.id === itemId);
      if (updatedItem) updateItem(itemId, updatedItem.quantity);
      return updated;
    });
  };

  const handlePromoCode = async (e) => {
    e.preventDefault();
    if (!authToken || !promoCode.trim()) return;
    setPromoMessage(null);
    try {
      const response = await axios.post("/promo/apply-promo", { code: promoCode }, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) {
        const discountAmount = response.data.promo || 0;
        setDiscount(discountAmount);
        setPromoMessage({ type: "success", text: `₹${discountAmount} discount applied!` });
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      setPromoMessage({ type: "error", text: "Invalid promo code" });
    }
  };

  const deleteItem = async (itemId) => {
    if (!authToken) return;
    try {
      setCart(prev => prev.filter(i => i.id !== itemId));
      const response = await axios.delete(`/cart/delete/${itemId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) fetchCart();
    } catch (error) { console.error("Error deleting item:", error); fetchCart(); }
  };

  const ClearCart = async () => {
    const id = userDetails.id;
    if (!authToken) return;
    try {
      const response = await axios.delete(`/cart/clear`, { data: { id }, headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) { setCart([]); setTotalCost(0); setDiscount(0); setClearConfirm(false); fetchCart(); }
    } catch (error) { console.error("Error clearing cart:", error); }
  };

  const handleCODCheckout = async () => {
    const orderDetails = { address: { street: "BH", city: "Greater Noida", state: "UP", zip: "130619", country: "India" } };
    if (!authToken) return;
    try {
      const response = await axios.post("/payments/create-payment", orderDetails, { responseType: "blob", headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } });
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `invoice.pdf`;
        link.click();
        handleConfirmation();
        ClearCart();
      }
    } catch (error) { console.error("Error creating payment:", error); }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.discountedPrice || item.itemPrice) * item.quantity, 0);
  const grandTotal = totalCost + shippingCost - discount;

  if (!isAuthenticated && !loading) {
    return (
      <div className="w-full min-h-screen bg-cream">
        <NavBar />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <FaShoppingCart size={56} className="text-orange/30 mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-dark mb-3">Your Cart Awaits</h2>
          <p className="text-muted mb-8">Please log in to view your cart and start shopping for fresh produce.</p>
          <Link to="/form" className="inline-flex items-center gap-2 px-8 py-3 bg-orange text-white rounded-xl font-semibold hover:bg-orange-hover transition-colors shadow-md">
            Log In to Shop <FaChevronRight size={12} />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-cream flex flex-col">
      <NavBar />

      {/* Breadcrumb */}
      <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-6 lg:px-10 pt-6">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link to="/" className="hover:text-orange transition-colors">Home</Link>
          <FaChevronRight size={8} />
          <span className="text-dark font-medium">Cart</span>
        </nav>
      </div>

      {/* Page Header */}
      <div className="max-w-[1300px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-dark">Shopping Cart</h1>
            {!loading && cart.length > 0 && (
              <p className="text-sm text-muted mt-1">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
            )}
          </div>
          {cart.length > 0 && (
            <div className="relative">
              {clearConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted hidden sm:inline">Clear all?</span>
                  <button onClick={ClearCart} className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors">Yes</button>
                  <button onClick={() => setClearConfirm(false)} className="px-3 py-1.5 border border-cream-dark text-dark text-xs font-semibold rounded-lg hover:bg-cream transition-colors">No</button>
                </div>
              ) : (
                <button onClick={() => setClearConfirm(true)} className="flex items-center gap-2 px-4 py-2 border border-cream-dark text-muted text-sm font-medium rounded-xl hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <FaTrash size={12} /> Clear Cart
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-orange border-t-transparent animate-spin" />
            <p className="text-muted font-medium">Loading cart...</p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="flex-1 max-w-[1300px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-12 flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 min-w-0">
            <div className="lg:hidden">
              <MobileCartItems cart={cart} deleteItem={deleteItem} handleQuantityChange={handleQuantityChange} />
            </div>
            <div className="hidden lg:block">
              <CartItems cart={cart} deleteItem={deleteItem} handleQuantityChange={handleQuantityChange} />
            </div>

            {/* Continue Shopping */}
            {cart.length > 0 && (
              <Link to="/market" className="inline-flex items-center gap-2 mt-4 text-sm text-muted hover:text-orange transition-colors font-medium">
                <FaChevronRight className="rotate-180" size={10} /> Continue Shopping
              </Link>
            )}
          </div>

          {/* Summary Panel */}
          {cart.length > 0 && (
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-2xl border border-cream-dark shadow-sm p-5 sticky top-24">
                <h2 className="font-serif text-xl font-bold text-dark mb-5">Order Summary</h2>

                {/* Items breakdown */}
                <div className="space-y-2.5 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted">Subtotal ({cart.length} items)</span>
                    <span className="font-semibold text-dark">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted flex items-center gap-1.5"><FaTruck size={12} className="text-orange" /> Shipping</span>
                    <span className="font-semibold text-dark">₹{shippingCost}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted flex items-center gap-1.5"><FaTag size={12} className="text-green-500" /> Discount</span>
                      <span className="font-semibold text-green-600">-₹{discount}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-cream-dark my-4" />

                {/* Total */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-dark text-base">Total</span>
                  <span className="font-bold text-dark text-xl">₹{grandTotal}</span>
                </div>
                <p className="text-[10px] text-muted mb-5">Inclusive of all taxes</p>

                {/* Promo Code */}
                <form onSubmit={handlePromoCode} className="mb-4">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 rounded-xl border border-cream-dark bg-cream text-sm text-dark placeholder-muted focus:outline-none focus:border-orange transition-colors"
                    />
                    <button type="submit" className="px-4 py-2 bg-dark text-white rounded-xl text-xs font-semibold hover:bg-orange transition-colors">Apply</button>
                  </div>
                  {promoMessage && (
                    <p className={`text-xs mt-1.5 font-medium ${promoMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </form>

                {/* Checkout Buttons */}
                <div className="space-y-2.5">
                  <motion.button
                    onClick={handleCODCheckout}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    className="w-full py-3 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    <FaTruck size={14} /> Cash on Delivery
                  </motion.button>
                  <motion.button
                    onClick={() => navigate("/place-order")}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                    className="w-full py-3 bg-dark text-white font-semibold rounded-xl hover:bg-dark/80 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <FaShieldAlt size={13} /> Pay by Card
                  </motion.button>
                </div>

                {/* Trust badges */}
                <div className="mt-5 pt-4 border-t border-cream-dark">
                  <div className="flex items-center justify-center gap-4 text-[10px] text-muted">
                    <span className="flex items-center gap-1"><FaShieldAlt size={10} className="text-green-500" /> Secure</span>
                    <span className="flex items-center gap-1"><FaTruck size={10} className="text-blue-500" /> Fast Delivery</span>
                    <span className="flex items-center gap-1"><FaLeaf size={10} className="text-orange" /> Fresh</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
