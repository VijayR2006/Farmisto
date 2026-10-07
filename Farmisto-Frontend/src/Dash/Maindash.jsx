import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/Auth";
import axios from "../utils/axios";
import { RiPlantFill } from "react-icons/ri";
import { IoWallet } from "react-icons/io5";
import { GrTransaction } from "react-icons/gr";
import { BsPeopleFill } from "react-icons/bs";
import { motion } from "framer-motion";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import DashHeader from "../Pages/FarmerDashboard/DashHeader";
import DiscountSection from "../Pages/FarmerDashboard/DiscountSection";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const StatCard = ({ label, value, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-2xl p-5 border border-cream-dark/50 shadow-sm flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0`} style={{ backgroundColor: `${color}15` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted font-medium uppercase tracking-wider">{label}</p>
      <p className="font-serif text-xl font-bold text-dark truncate mt-0.5">{value ?? "—"}</p>
    </div>
  </motion.div>
);

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#8C8C7A", font: { size: 11 } } },
    y: { grid: { color: "#EDE6D4" }, ticks: { color: "#8C8C7A", font: { size: 11 } } },
  },
};

const doughnutOptions = {
  responsive: true,
  plugins: { legend: { position: "bottom", labels: { padding: 16, font: { size: 11 } } } },
  cutout: "75%",
};

const barData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [{
    data: [12000, 9000, 18000, 14000, 22000, 16000, 24000, 19000],
    backgroundColor: "#E8621A",
    borderRadius: 6,
    barThickness: 28,
  }],
};

const doughnutData = {
  labels: ["Vegetables", "Fruits", "Dairy", "Spices"],
  datasets: [{
    data: [40, 30, 20, 10],
    backgroundColor: ["#E8621A", "#E8C547", "#1A1A1A", "#EDE6D4"],
    borderWidth: 0,
  }],
};

const recentActivity = [
  { action: "New order received", buyer: "Priya S.", amount: "₹240", time: "2 min ago", status: "Pending" },
  { action: "Payment confirmed", buyer: "Ravi K.", amount: "₹580", time: "18 min ago", status: "Paid" },
  { action: "Item listed", buyer: "Your store", amount: "Tomatoes", time: "1 hr ago", status: "Live" },
  { action: "Negotiation request", buyer: "Anita M.", amount: "₹120", time: "3 hr ago", status: "Pending" },
];

const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-700",
  Paid: "bg-green-100 text-green-700",
  Live: "bg-blue-100 text-blue-700",
};

const Dashboard = () => {
  const { authToken } = useAuth();
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const GetDashboard = async () => {
      try {
        const response = await axios.get("/farmer/dashboard", { headers: { Authorization: `Bearer ${authToken}` } });
        if (response.status === 200) setDashboardData(response.data.dashboard);
      } catch (error) { console.error("Error fetching dashboard data: ", error); }
    };
    if (authToken) GetDashboard();
  }, [authToken]);

  const stats = [
    { label: "Total Produce Sold", value: `${dashboardData.produceCount?.amount ?? 0} ${dashboardData.produceCount?.unit ?? "kg"}`, icon: RiPlantFill, color: "#6CC24A" },
    { label: "Revenue", value: `₹${dashboardData.revenue ?? 0}`, icon: IoWallet, color: "#E8C547" },
    { label: "Transactions", value: dashboardData.totalTransactions ?? 0, icon: GrTransaction, color: "#E8621A" },
    { label: "Users Reached", value: dashboardData.userReach ?? 0, icon: BsPeopleFill, color: "#1A1A1A" },
  ];

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-cream scrollbar-none">
      <DashHeader />

      <div className="px-5 lg:px-8 py-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-cream-dark/50 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider font-medium">Monthly Revenue</p>
                <h3 className="font-serif text-xl font-bold text-dark mt-1">Performance Overview</h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 bg-orange/10 text-orange rounded-lg">2025</span>
            </div>
            <Bar data={barData} options={barOptions} height={160} />
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 shadow-sm">
            <div className="mb-5">
              <p className="text-xs text-muted uppercase tracking-wider font-medium">Sales by Category</p>
              <h3 className="font-serif text-xl font-bold text-dark mt-1">Product Mix</h3>
            </div>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Recent Activity + Discount Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-cream-dark/50 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-dark mb-5">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cream-dark flex items-center justify-center text-dark font-bold text-sm shrink-0">
                      {item.buyer[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark">{item.action}</p>
                      <p className="text-xs text-muted">{item.buyer} · {item.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-dark">{item.amount}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[item.status] || "bg-cream-dark text-dark"}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discounts / Promos */}
          <div className="bg-dark rounded-2xl p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-orange mb-2">Promotions</p>
            <h3 className="font-serif text-lg font-bold mb-4">Active Promo Codes</h3>
            <div className="space-y-3">
              {["FARM20", "FRESH10", "SAVE15"].map((code, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                  <span className="font-mono text-sm font-bold text-orange">{code}</span>
                  <span className="text-xs text-white/60">{[20, 10, 15][i]}% off</span>
                </div>
              ))}
            </div>
            <a href="/farmer/discounts" className="mt-5 block text-center text-sm font-semibold text-orange hover:underline">
              Manage Discounts →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
