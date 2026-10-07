import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/Auth";
import {
  FaSearch, FaMapMarkerAlt, FaLeaf, FaStore,
  FaChevronRight, FaSeedling,
  FaFilter, FaTimes, FaSortAmountDown, FaCheckCircle,
  FaShoppingBag, FaArrowRight
} from "react-icons/fa";
import { BsGrid3X3Gap, BsListUl } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=200&fit=crop",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=200&fit=crop",
];

const CATEGORY_ICONS = {
  Vegetables: "🥬",
  Fruits: "🍎",
  Nuts: "🥜",
  Dairy: "🥛",
  Spices: "🌶️",
  Pulses: "🫘",
};

const NearbyFarmers = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/user/fetch-nearby-farmers", {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setFarmers(response.data.farmers || []);
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError("Failed to load nearby farmers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (authToken) fetchFarmers();
    else {
      setLoading(false);
      setError("Please log in to see nearby farmers.");
    }
  }, [authToken]);

  const allCategories = useMemo(() => {
    const cats = new Set();
    farmers.forEach(f => f.categories?.forEach(c => cats.add(c)));
    return Array.from(cats);
  }, [farmers]);

  const filteredFarmers = useMemo(() => {
    let result = [...farmers];
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(f =>
        f.userName?.toLowerCase().includes(term) ||
        f.farmerCity?.toLowerCase().includes(term) ||
        f.farmerAddress?.toLowerCase().includes(term)
      );
    }
    if (selectedCategory) {
      result = result.filter(f => f.categories?.includes(selectedCategory));
    }
    result.sort((a, b) => {
      if (sortBy === "distance") return (a.distance || 999) - (b.distance || 999);
      if (sortBy === "items") return (b.itemCount || 0) - (a.itemCount || 0);
      if (sortBy === "name") return (a.userName || "").localeCompare(b.userName || "");
      return 0;
    });
    return result;
  }, [farmers, search, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredFarmers.length / ITEMS_PER_PAGE);
  const paginatedFarmers = filteredFarmers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search, selectedCategory, sortBy]);

  const stats = useMemo(() => ({
    total: farmers.length,
    totalItems: farmers.reduce((sum, f) => sum + (f.itemCount || 0), 0),
    avgDistance: farmers.length ? (farmers.reduce((sum, f) => sum + (f.distance || 0), 0) / farmers.length).toFixed(1) : 0,
  }), [farmers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-orange border-t-transparent animate-spin" />
          <p className="text-muted font-medium">Finding farmers near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <NavBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark via-dark/95 to-dark/90 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-orange/5 blur-3xl" />
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-orange/10" />
          <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full border border-orange/10" />
        </div>

        <div className="relative max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/20 rounded-full text-orange text-sm font-semibold mb-6">
              <FaSeedling size={14} /> Fresh & Local
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Nearby <span className="italic font-normal text-orange">Farmers</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              Discover local farmers within 30km bringing you the freshest farm-to-table produce.
            </p>

            <div className="flex items-center justify-center gap-8 sm:gap-12">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange">{stats.total}</p>
                <p className="text-xs text-white/60 mt-1">Farmers</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-orange">{stats.totalItems}</p>
                <p className="text-xs text-white/60 mt-1">Products</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-orange">{stats.avgDistance}<span className="text-lg">km</span></p>
                <p className="text-xs text-white/60 mt-1">Avg Distance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="flex-grow max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 py-8 w-full">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farmers, city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark bg-white text-dark text-sm placeholder-muted focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors">
                <FaTimes size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-40 pl-3 pr-8 py-2.5 rounded-xl border border-cream-dark bg-white text-dark text-sm focus:outline-none focus:border-orange appearance-none cursor-pointer"
              >
                <option value="distance">Nearest First</option>
                <option value="items">Most Products</option>
                <option value="name">Name A-Z</option>
              </select>
              <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-xs pointer-events-none" />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-orange text-white border-orange" : "border-cream-dark bg-white text-dark hover:border-orange"}`}
            >
              <FaFilter size={12} />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <div className="hidden md:flex items-center bg-white rounded-xl border border-cream-dark p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-dark text-white" : "text-muted hover:text-dark"}`}
              >
                <BsGrid3X3Gap size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-dark text-white" : "text-muted hover:text-dark"}`}
              >
                <BsListUl size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap gap-2 pb-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${!selectedCategory ? "bg-orange text-white" : "bg-white border border-cream-dark text-muted hover:border-orange hover:text-orange"}`}
                >
                  All
                </button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${selectedCategory === cat ? "bg-orange text-white" : "bg-white border border-cream-dark text-muted hover:border-orange hover:text-orange"}`}
                  >
                    <span>{CATEGORY_ICONS[cat] || "🌱"}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <p className="text-xs text-muted mb-4">
          {filteredFarmers.length} farmer{filteredFarmers.length !== 1 ? "s" : ""} found
          {selectedCategory && ` in ${selectedCategory}`}
          {totalPages > 1 && ` — Page ${page} of ${totalPages}`}
        </p>

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-hover transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Farmers Grid/List */}
        {!error && paginatedFarmers.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedFarmers.map((farmer, i) => (
                  <FarmerCard key={farmer.id} farmer={farmer} index={i} navigate={navigate} coverImg={COVER_IMAGES[i % COVER_IMAGES.length]} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedFarmers.map((farmer, i) => (
                  <FarmerListItem key={farmer.id} farmer={farmer} index={i} navigate={navigate} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-cream-dark bg-white text-sm font-medium text-dark hover:bg-orange hover:text-white hover:border-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${page === p ? "bg-orange text-white shadow-sm" : "border border-cream-dark bg-white text-dark hover:bg-orange hover:text-white"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-cream-dark bg-white text-sm font-medium text-dark hover:bg-orange hover:text-white hover:border-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : !error && (
          <div className="text-center py-24">
            <FaLeaf size={48} className="text-orange/30 mx-auto mb-5" />
            <p className="font-serif text-2xl font-bold text-dark mb-2">No Farmers Found</p>
            <p className="text-muted mb-6">Try adjusting your search or filters.</p>
            {(search || selectedCategory) && (
              <button
                onClick={() => { setSearch(""); setSelectedCategory(""); }}
                className="px-6 py-2.5 bg-orange text-white rounded-xl text-sm font-semibold hover:bg-orange-hover transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

/* ─── Farmer Card (Grid View) ─── */
const FarmerCard = ({ farmer, index, navigate, coverImg }) => {
  const imgSrc = farmer.farmerProfilePhoto && farmer.farmerProfilePhoto !== "default_farmer_profile.jpg"
    ? farmer.farmerProfilePhoto
    : PLACEHOLDER_IMG;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-xl hover:border-orange/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      {/* Cover Image */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={coverImg}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=200&fit=crop";
          }}
          alt="farm cover"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
        {/* Distance badge */}
        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-bold text-orange shadow-sm flex items-center gap-1">
          <FaMapMarkerAlt size={8} />
          {farmer.distance}km
        </span>
      </div>

      {/* Profile Image - overlaps cover */}
      <div className="relative px-4 -mt-8">
        <div className="relative w-16 h-16">
          <img
            src={imgSrc}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER_IMG;
            }}
            alt={farmer.userName}
            className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
          {/* Verified badge */}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
            <FaCheckCircle size={10} className="text-white" />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 pt-3">
        <h3 className="font-serif text-lg font-bold text-dark group-hover:text-orange transition-colors truncate">
          {farmer.userName}
        </h3>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
          <FaMapMarkerAlt className="text-orange shrink-0" size={10} />
          <span className="truncate">{farmer.farmerCity}, {farmer.farmerCountry}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
          <FaShoppingBag className="text-orange shrink-0" size={10} />
          <span>{farmer.itemCount} products available</span>
        </div>

        {/* Category tags */}
        {farmer.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {farmer.categories.slice(0, 3).map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream rounded-lg text-[10px] font-medium text-dark border border-cream-dark">
                {CATEGORY_ICONS[cat]} {cat}
              </span>
            ))}
            {farmer.categories.length > 3 && (
              <span className="px-2 py-0.5 bg-cream rounded-lg text-[10px] font-medium text-muted border border-cream-dark">
                +{farmer.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => navigate("/market")}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange text-white rounded-xl text-xs font-semibold hover:bg-orange-hover transition-colors shadow-sm"
          >
            <FaStore size={10} /> Shop Now
          </button>
          <button
            onClick={() => navigate("/Profile", { state: { farmerId: farmer.id } })}
            className="px-3 py-2.5 rounded-xl border border-cream-dark text-dark text-xs font-medium hover:bg-orange hover:text-white hover:border-orange transition-colors"
          >
            <FaArrowRight size={10} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Farmer List Item (List View) ─── */
const FarmerListItem = ({ farmer, index, navigate }) => {
  const imgSrc = farmer.farmerProfilePhoto && farmer.farmerProfilePhoto !== "default_farmer_profile.jpg"
    ? farmer.farmerProfilePhoto
    : PLACEHOLDER_IMG;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="bg-white rounded-2xl border border-cream-dark shadow-sm hover:shadow-lg hover:border-orange/20 transition-all duration-200 p-4 flex items-center gap-4 group"
    >
      <div className="relative shrink-0">
        <img
          src={imgSrc}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMG;
          }}
          alt={farmer.userName}
          className="w-16 h-16 rounded-xl object-cover border-2 border-cream-dark group-hover:border-orange/30 transition-colors"
        />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
          <FaCheckCircle size={9} className="text-white" />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-base font-bold text-dark group-hover:text-orange transition-colors truncate">{farmer.userName}</h3>
          <span className="px-2 py-0.5 bg-orange/10 rounded-full text-[10px] font-bold text-orange shrink-0 flex items-center gap-1">
            <FaMapMarkerAlt size={7} /> {farmer.distance}km
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted">
          <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-orange" size={9} /> {farmer.farmerCity}</span>
          <span className="flex items-center gap-1"><FaShoppingBag className="text-orange" size={9} /> {farmer.itemCount} items</span>
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          {farmer.categories?.length > 0 && (
            <div className="flex gap-1">
              {farmer.categories.slice(0, 4).map(cat => (
                <span key={cat} className="text-[10px]">{CATEGORY_ICONS[cat]}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate("/market")}
        className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-orange text-white rounded-xl text-xs font-semibold hover:bg-orange-hover transition-colors shadow-sm shrink-0"
      >
        <FaStore size={10} /> Shop
      </button>
      <button
        onClick={() => navigate("/Profile", { state: { farmerId: farmer.id } })}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-cream-dark text-muted hover:text-orange hover:border-orange transition-colors shrink-0"
      >
        <FaChevronRight size={12} />
      </button>
    </motion.div>
  );
};

export default NearbyFarmers;
