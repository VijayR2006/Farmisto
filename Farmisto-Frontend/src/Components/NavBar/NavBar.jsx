import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Auth";
import { useCart } from "../../utils/CartContext";
import { FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiLogOut, FiGrid, FiChevronDown, FiSettings, FiPackage } from "react-icons/fi";
import { FaSeedling, FaLeaf } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const { authToken, userDetails, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdown(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".user-dropdown")) setUserDropdown(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const navLinks = [
    { label: "Market", path: "/market" },
    { label: "Nearby Farmers", path: "/farmers" },
    { label: "About", path: "/about" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/market?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate("/");
  };

  const isFarmer = userDetails?.role === "farmer";
  const userName = userDetails?.name || "User";

  return (
    <>
      {/* Top accent bar */}
      <div className="w-full h-0.5 bg-gradient-to-r from-orange via-orange-hover to-[#E8C547]" />

      <nav className={`w-full bg-cream/95 backdrop-blur-md px-4 sm:px-6 md:px-10 lg:px-16 py-3 flex items-center justify-between relative z-50 sticky top-0 transition-all duration-300 ${scrolled ? "shadow-lg shadow-dark/5 border-b border-cream-dark" : "border-b border-cream-dark/50"}`}>
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 group flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-orange/30 transition-all">
            <FaLeaf size={16} className="text-white" />
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold text-dark tracking-tight group-hover:text-orange transition-colors">
            farm<span className="italic text-orange group-hover:text-orange-hover">isto</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                isActive(link.path)
                  ? "text-orange"
                  : "text-muted hover:text-dark hover:bg-cream-dark/50"
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <div className="hidden md:block relative">
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  initial={{ width: 40, opacity: 0.5 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 40, opacity: 0.5 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="flex items-center"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search produce, farmers..."
                    className="w-full h-9 pl-3 pr-8 rounded-full border border-cream-dark bg-white text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all"
                    onBlur={() => !searchTerm && setSearchOpen(false)}
                  />
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchTerm(""); }} className="absolute right-2 text-muted hover:text-dark">
                    <FiX size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-dark transition-colors text-muted hover:text-dark"
                >
                  <FiSearch size={17} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <Link to="/cart">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-dark transition-colors text-muted hover:text-dark relative"
            >
              <FiShoppingCart size={17} />
              {/* Cart badge */}
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.div>
          </Link>

          {/* User Section */}
          {isAuthenticated ? (
            <div className="hidden md:block relative user-dropdown">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setUserDropdown(!userDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${userDropdown ? "bg-cream-dark" : "hover:bg-cream-dark"}`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange to-orange-hover flex items-center justify-center shadow-sm">
                  <FiUser size={13} className="text-white" />
                </div>
                <span className="text-sm font-medium text-dark max-w-[80px] truncate">{userName}</span>
                <FiChevronDown size={14} className={`text-muted transition-transform duration-200 ${userDropdown ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-cream-dark overflow-hidden"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3.5 border-b border-cream-dark bg-gradient-to-r from-cream to-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange to-orange-hover flex items-center justify-center shadow-sm">
                          <FiUser size={16} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-dark truncate">{userName}</p>
                          <p className="text-xs text-muted truncate">{userDetails?.email}</p>
                        </div>
                      </div>
                      <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${isFarmer ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {isFarmer ? "Farmer" : "Consumer"}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {isFarmer && (
                        <>
                          <Link to="/farmer/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-cream transition-colors">
                            <FiGrid size={15} className="text-orange" />
                            Dashboard
                          </Link>
                          <Link to="/farmer/settings/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-cream transition-colors">
                            <FiSettings size={15} className="text-muted" />
                            Settings
                          </Link>
                        </>
                      )}
                      <Link to="/cart" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-cream transition-colors">
                        <FiShoppingCart size={15} className="text-muted" />
                        My Cart
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-cream transition-colors">
                        <FiPackage size={15} className="text-muted" />
                        Orders
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-cream-dark">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut size={15} />
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/form"
                className="px-4 py-2 text-sm font-medium text-dark hover:text-orange transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/form"
                className="px-5 py-2 rounded-full bg-orange text-white text-sm font-semibold hover:bg-orange-hover transition-all shadow-sm hover:shadow-md hover:shadow-orange/20 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-cream-dark transition-colors text-dark"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <motion.div
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-full left-0 w-full bg-cream shadow-xl overflow-hidden md:hidden border-t border-cream-dark"
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-5 pt-4 pb-2">
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search produce, farmers..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-dark placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
                  />
                </div>
              </form>

              {/* Mobile Links */}
              <div className="px-5 py-3 space-y-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-orange/10 text-orange"
                        : "text-dark hover:bg-cream-dark"
                    }`}
                  >
                    {isActive(link.path) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange" />
                    )}
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile User Section */}
              <div className="px-5 py-4 border-t border-cream-dark">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange to-orange-hover flex items-center justify-center shadow-sm">
                        <FiUser size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark">{userName}</p>
                        <p className="text-xs text-muted">{userDetails?.email}</p>
                      </div>
                    </div>
                    {isFarmer && (
                      <Link
                        to="/farmer/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-dark hover:bg-cream-dark transition-colors"
                      >
                        <FiGrid size={15} className="text-orange" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                    >
                      <FiLogOut size={15} />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to="/form"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-2.5 text-center rounded-xl border border-cream-dark text-sm font-medium text-dark hover:bg-cream-dark transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/form"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-2.5 text-center rounded-xl bg-orange text-white text-sm font-semibold hover:bg-orange-hover transition-colors shadow-sm"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default NavBar;
