import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import assets from "../../assets/assets";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    if (location.state) setData(location.state.data.confirmData || {});
  }, [location.state]);

  return (
    <div className="min-h-screen bg-cream flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-cream-dark/50">
        {/* Header */}
        <div className="bg-cream-dark px-8 py-6 flex items-center justify-between border-b border-cream-dark/50">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange">Order Confirmed</p>
            <h2 className="font-serif text-2xl font-bold text-dark mt-1">Thanks for your order!</h2>
          </div>
          <img src={assets.truck} alt="Delivery" className="h-14 w-14 object-contain opacity-80" />
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          {data.buyer?.name && (
            <p className="text-muted text-sm mb-6">
              Hello, <span className="text-dark font-semibold">{data.buyer.name}</span> 👋
            </p>
          )}

          <h3 className="font-serif text-lg font-bold text-dark mb-4">Payment Summary</h3>
          <div className="space-y-3 pb-5 border-b border-cream-dark">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Items ({data.cart?.length || 0})</span>
              <span className="font-semibold text-dark">₹{data.grandTotal || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Shipping</span>
              <span className="font-semibold text-dark">₹10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Tax (GST 18%)</span>
              <span className="font-semibold text-dark">₹{((data.grandTotal || 0) * 0.18).toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between pt-5 text-base font-bold text-dark">
            <span>Total</span>
            <span className="text-orange">₹{(((data.grandTotal || 0) * 0.18) + (data.grandTotal || 0) + 10).toFixed(2)}</span>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <button className="w-full py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors shadow-md text-sm">
              Track Your Order
            </button>
            <button onClick={() => navigate("/")} className="w-full py-3.5 border border-cream-dark text-dark font-semibold rounded-xl hover:bg-cream-dark/50 transition-colors text-sm">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;