import React, { useState } from "react";
import {
  AiFillBell, AiFillSetting, AiOutlineCheck, AiOutlineClose, AiOutlineMessage,
} from "react-icons/ai";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/Auth";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Awaiting Response": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
};

const DashHeader = () => {
  const { authToken, userDetails, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const negotiations = [
    { id: 1, requester: { name: "John Doe", location: "New York, USA" }, message: "Negotiation started for Product A", status: "Pending" },
    { id: 2, requester: { name: "Jane Smith", location: "London, UK" }, message: "Offer received for Product B", status: "In Progress" },
    { id: 3, requester: { name: "Alice Johnson", location: "Sydney, AU" }, message: "Counteroffer sent for Product C", status: "Awaiting Response" },
    { id: 4, requester: { name: "Bob Brown", location: "Toronto, CA" }, message: "Negotiation closed for Product D", status: "Completed" },
  ];

  const initials = userDetails?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  return (
    <>
      <div className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-cream-dark/60 sticky top-0 z-10">
        {/* Left: Greeting */}
        <div>
          <p className="text-xs text-muted font-medium">Good morning,</p>
          <h3 className="font-serif text-lg font-bold text-dark leading-tight capitalize">{userDetails?.name || "Farmer"} 👋</h3>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(s => !s)}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-cream hover:bg-cream-dark transition-colors"
            >
              <AiFillBell size={18} className="text-dark" />
              {negotiations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {negotiations.length}
                </span>
              )}
            </button>
          </div>

          {/* Settings */}
          <Link to="/farmer/settings" className="w-10 h-10 flex items-center justify-center rounded-xl bg-cream hover:bg-cream-dark transition-colors">
            <AiFillSetting size={18} className="text-dark" />
          </Link>

          {/* User avatar / login */}
          {authToken ? (
            <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark text-white text-sm font-semibold hover:bg-orange transition-colors">
              <BsFillDoorOpenFill size={14} />
              <span className="hidden sm:block">Log Out</span>
            </button>
          ) : (
            <Link to="/farmer/register" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange text-white text-sm font-semibold hover:bg-orange-hover transition-colors">
              <FaUser size={14} />
              <span className="hidden sm:block">Sign In</span>
            </Link>
          )}

          {/* Avatar chip */}
          <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-16 right-4 sm:right-6 w-[90vw] sm:w-96 z-50 bg-white rounded-2xl shadow-2xl border border-cream-dark/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-cream-dark flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-dark">Negotiations ({negotiations.length})</h3>
            <button onClick={() => setShowNotifications(false)} className="text-muted hover:text-dark text-xl leading-none">×</button>
          </div>
          <ul className="divide-y divide-cream-dark max-h-96 overflow-y-auto">
            {negotiations.map(n => (
              <li key={n.id} className="p-4 hover:bg-cream transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-cream-dark flex items-center justify-center text-dark font-bold text-sm shrink-0">
                    {n.requester.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark text-sm truncate">{n.requester.name}</p>
                    <p className="text-xs text-muted truncate">{n.requester.location}</p>
                    <p className="text-sm text-dark/70 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[n.status] || "bg-cream-dark text-dark"}`}>{n.status}</span>
                </div>
                <div className="flex gap-2 ml-12">
                  <button onClick={() => console.log("Accept", n.id)} className="flex-1 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors">
                    <AiOutlineCheck size={12} /> Accept
                  </button>
                  <button onClick={() => console.log("Decline", n.id)} className="flex-1 py-1.5 bg-red-400 hover:bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors">
                    <AiOutlineClose size={12} /> Decline
                  </button>
                  <button onClick={() => console.log("Chat", n.id)} className="flex-1 py-1.5 border border-cream-dark text-dark text-xs font-semibold rounded-lg flex items-center justify-center gap-1 hover:bg-cream transition-colors">
                    <AiOutlineMessage size={12} /> Chat
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default DashHeader;
