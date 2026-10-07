import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBox, FaLeaf } from "react-icons/fa";
import {
  MdDiscount, MdHome, MdMessage, MdShoppingCart, MdSpaceDashboard,
} from "react-icons/md";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useAuth } from "../utils/Auth";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";

const routes = [
  { path: "/farmer/dashboard", name: "Dashboard", icon: MdSpaceDashboard },
  { path: "/farmer/add-item", name: "Add Items", icon: MdShoppingCart },
  { path: "/farmer/orders", name: "Orders", icon: FaBox },
  { path: "/farmer/messages", name: "Messages", icon: MdMessage },
  { path: "/farmer/discounts", name: "Discounts", icon: MdDiscount },
  { path: "/farmer/settings", name: "Settings", icon: AiFillSetting },
];

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout, authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("sideNavOpen");
    if (saved !== null) setIsOpen(JSON.parse(saved));
  }, []);

  const toggleNav = () => {
    setIsOpen(prev => {
      const next = !prev;
      localStorage.setItem("sideNavOpen", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className={`${isOpen ? "w-56 lg:w-60" : "w-16"} h-screen relative z-20 flex flex-col bg-dark text-white shrink-0 transition-all duration-300 overflow-hidden`}>
      {/* Top: Logo + Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {isOpen && (
          <div className="flex items-center gap-2">
            <FaLeaf size={18} className="text-orange shrink-0" />
            <span className="font-serif text-lg font-bold tracking-tight">farm<span className="italic font-normal">isto</span></span>
          </div>
        )}
        <button onClick={toggleNav} className={`${!isOpen ? "mx-auto" : ""} w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors`}>
          <HiOutlineBars3 size={22} />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-none">
        {/* Home link */}
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
          <MdHome size={20} className="shrink-0" />
          {isOpen && <span>Back to Home</span>}
        </NavLink>

        <div className={`${isOpen ? "px-3 pt-4 pb-1" : "hidden"}`}>
          <span className="text-xs font-bold uppercase tracking-widest text-white/30">Farmer Tools</span>
        </div>
        {!isOpen && <div className="border-t border-white/10 my-2" />}

        {routes.map((route, i) => (
          <NavLink
            key={i}
            to={route.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-orange text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`
            }
          >
            <route.icon size={20} className="shrink-0" />
            {isOpen && <span>{route.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Bottom: User Actions */}
      <div className="border-t border-white/10 px-2 py-3">
        {authToken && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <BsFillDoorOpenFill size={18} className="shrink-0" />
            {isOpen && <span>Log Out</span>}
          </button>
        )}
        {isOpen && (
          <div className="mt-4 bg-orange/10 border border-orange/20 rounded-xl p-3 mx-1">
            <p className="text-xs font-bold text-orange mb-1">Pro Tip</p>
            <p className="text-xs text-white/60 leading-relaxed">Add discounts to boost your product visibility in the market!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNav;
