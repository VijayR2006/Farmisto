import React, { useEffect, useState } from "react";
import SideNav from "./SideNav";
import axios from "../utils/axios";
import { useAuth } from "../utils/Auth";
import moment from "moment";
import { styled } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { FaSearch } from "react-icons/fa";

const StyledPagination = styled(Pagination)(() => ({
  "& .MuiPaginationItem-root": {
    color: "#1A1A1A",
    "&:hover": { backgroundColor: "#EDE6D4" },
    "&.Mui-selected": { backgroundColor: "#E8621A", color: "white", "&:hover": { backgroundColor: "#d05515" } },
  },
}));

const statusStyles = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-600",
};

const TABS = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

const Order = () => {
  const { authToken } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderIndex, setOrderIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/payments/farmer-get-payment", { headers: { Authorization: `Bearer ${authToken}` } });
        if (response.status === 200 && Array.isArray(response.data.payments)) setAllOrders(response.data.payments);
      } catch (error) { console.error("Error fetching orders:", error); }
    };
    fetchOrders();
  }, [authToken]);

  useEffect(() => {
    let filtered = allOrders;
    if (activeTab !== "All Orders") filtered = filtered.filter(o => o.orderStatus === activeTab);
    if (searchQuery) filtered = filtered.filter(o => o._id.includes(searchQuery) || o.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [activeTab, searchQuery, allOrders]);

  const SetOrderStatus = async (id, value) => {
    try {
      await axios.patch(`/payments/farmer-update-payment`, { field: "orderStatus", value, id }, { headers: { Authorization: `Bearer ${authToken}` } });
      setAllOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: value } : o));
    } catch (error) { console.error("Error updating order status:", error); }
  };

  const start = (currentPage - 1) * itemsPerPage;
  const displayedOrders = filteredOrders.slice(start, start + itemsPerPage);

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <SideNav />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-cream-dark/60 shrink-0">
          <div>
            <p className="text-xs text-muted font-medium">Farmer Portal</p>
            <h2 className="font-serif text-lg font-bold text-dark">Orders</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-6 scrollbar-none">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab ? "bg-dark text-white" : "bg-white text-muted border border-cream-dark hover:bg-cream"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-sm mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-cream-dark bg-white text-dark placeholder-muted focus:outline-none focus:border-orange text-sm"
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-cream-dark/50 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-6 px-5 py-3.5 bg-cream-dark/30 text-xs font-bold text-muted uppercase tracking-wider border-b border-cream-dark">
              {["Order", "Date", "Buyer", "Payment", "Status", "Amount"].map(h => <span key={h}>{h}</span>)}
            </div>

            {displayedOrders.length > 0 ? displayedOrders.map((item, i) => (
              <div
                key={item._id}
                className="grid grid-cols-6 px-5 py-4 border-b border-cream-dark/30 hover:bg-cream transition-colors items-center"
                onMouseLeave={() => setOrderIndex(null)}
              >
                <div>
                  <p className="text-sm font-semibold text-dark">Order-{start + i + 1}</p>
                  <p className="text-xs text-muted truncate max-w-[80px]">#{item._id}</p>
                </div>
                <p className="text-sm text-muted">{moment(item.createdAt).format("MMM D, YYYY")}</p>
                <p className="text-sm font-medium text-dark">{item.buyer.name}</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${item.paymentMethod === "Paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {item.paymentMethod}
                </span>
                <div className="relative">
                  <span
                    onClick={() => setOrderIndex(i === orderIndex ? null : i)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer select-none hover:opacity-80 ${statusStyles[item.orderStatus] || "bg-cream-dark text-dark"}`}
                  >
                    {item.orderStatus}
                  </span>
                  {orderIndex === i && (
                    <div className="absolute top-7 left-0 bg-white shadow-xl rounded-xl border border-cream-dark z-20 flex flex-col overflow-hidden w-36">
                      {["Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                        <button
                          key={s}
                          onClick={() => { SetOrderStatus(item._id, s); setOrderIndex(null); }}
                          className="text-left px-4 py-2.5 text-sm hover:bg-cream font-medium text-dark transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm font-bold text-dark">₹{item.totalAmount}</p>
              </div>
            )) : (
              <div className="py-16 text-center">
                <p className="font-serif text-lg font-bold text-dark mb-1">No orders found</p>
                <p className="text-sm text-muted">Try adjusting your search or filter.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredOrders.length > itemsPerPage && (
            <div className="flex justify-center mt-8">
              <StyledPagination count={Math.ceil(filteredOrders.length / itemsPerPage)} page={currentPage} onChange={(_, v) => setCurrentPage(v)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
