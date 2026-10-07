import React, { useEffect } from "react";
import SideNav from "../../Dash/SideNav";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaCreditCard, FaQuestionCircle, FaBalanceScale } from "react-icons/fa";

const settingsData = [
  { options: "Profile Settings", link: "profile", icon: FaUser },
  { options: "Payment Settings", link: "payment", icon: FaCreditCard },
  { options: "Help & Support", link: "help", icon: FaQuestionCircle },
  { options: "Legal & Compliance", link: "legal", icon: FaBalanceScale },
];

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to profile if on /farmer/settings directly
  useEffect(() => {
    if (location.pathname === "/farmer/settings" || location.pathname === "/farmer/settings/") {
      navigate("profile", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <SideNav />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="w-full h-16 flex items-center px-6 bg-white border-b border-cream-dark/60 shrink-0">
          <div>
            <p className="text-xs text-muted font-medium">Farmer Portal</p>
            <h2 className="font-serif text-lg font-bold text-dark">Settings</h2>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Settings navigation panel */}
          <div className="w-64 shrink-0 bg-white border-r border-cream-dark/50 flex flex-col overflow-y-auto py-6 px-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted px-3 mb-3">Settings</p>
            <div className="space-y-1">
              {settingsData.map((section, i) => (
                <NavLink
                  key={i}
                  to={section.link}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange text-white"
                        : "text-muted hover:text-dark hover:bg-cream"
                    }`
                  }
                >
                  <section.icon size={16} className="shrink-0" />
                  {section.options}
                </NavLink>
              ))}
            </div>

            {/* Info card at bottom */}
            <div className="mt-auto mx-2 bg-dark rounded-2xl p-4 text-white">
              <p className="text-xs font-bold text-orange mb-1 uppercase tracking-wider">Pro Tip</p>
              <p className="text-xs text-white/60 leading-relaxed">Keep your profile and payment details up-to-date to get paid faster.</p>
            </div>
          </div>

          {/* Outlet: content for each settings sub-route */}
          <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-8 scrollbar-none">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
