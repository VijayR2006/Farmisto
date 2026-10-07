import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useAuth } from "../utils/Auth";
import { FaWallet, FaCheckCircle, FaClock } from "react-icons/fa";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 flex items-center gap-5 shadow-sm">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={20} className="text-white" />
    </div>
    <div>
      <p className="text-xs font-bold text-muted uppercase tracking-wider">{label}</p>
      <p className="font-serif text-2xl font-bold text-dark mt-0.5">₹{Number(value || 0).toLocaleString("en-IN")}</p>
    </div>
  </div>
);

const Payments = () => {
  const { authToken } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/payments/farmer-get-payment", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setPayments(response.data.payments || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Unable to load payment data.");
      } finally {
        setLoading(false);
      }
    };
    if (authToken) fetchPayments();
  }, [authToken]);

  const totalReceived = payments
    .filter((p) => p.orderStatus === "Delivered")
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const totalPending = payments
    .filter((p) => p.orderStatus !== "Delivered")
    .reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const grandTotal = totalReceived + totalPending;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 border-orange border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-dark">Payments Overview</h2>
        <p className="text-sm text-muted mt-1">Your payment summary across all orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FaWallet} label="Total Amount" value={grandTotal} color="bg-dark" />
        <StatCard icon={FaCheckCircle} label="Received" value={totalReceived} color="bg-orange" />
        <StatCard icon={FaClock} label="Pending" value={totalPending} color="bg-muted" />
      </div>

      {/* Payment Table */}
      {payments.length > 0 ? (
        <div className="bg-white rounded-2xl border border-cream-dark/50 overflow-hidden">
          <div className="grid grid-cols-4 gap-2 px-5 py-3 bg-cream border-b border-cream-dark text-xs font-bold text-muted uppercase tracking-wider">
            <span>Order ID</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Status</span>
          </div>
          {payments.map((p) => (
            <div key={p._id} className="grid grid-cols-4 gap-2 px-5 py-4 border-b last:border-0 border-cream-dark/40 items-center">
              <span className="text-xs font-mono text-muted truncate">{p._id?.slice(-8)?.toUpperCase()}</span>
              <span className="font-semibold text-dark text-sm">₹{Number(p.totalAmount || 0).toLocaleString("en-IN")}</span>
              <span className="text-sm text-muted capitalize">{p.paymentMethod || "—"}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${p.orderStatus === "Delivered"
                ? "bg-green-100 text-green-700"
                : p.orderStatus === "Processing"
                  ? "bg-orange/10 text-orange"
                  : "bg-cream-dark text-muted"
                }`}>
                {p.orderStatus || "Pending"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-cream-dark/50">
          <FaWallet size={36} className="mx-auto text-muted opacity-40 mb-4" />
          <p className="font-serif text-xl font-bold text-dark">No payments yet</p>
          <p className="text-sm text-muted mt-1">Your payment history will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Payments;
