import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaAppleAlt, FaSeedling, FaShoppingBasket, FaCarrot,
  FaPepperHot, FaLeaf, FaFish, FaMinus, FaPlus, FaCartPlus,
  FaStore, FaStar, FaBoxOpen,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/Auth";
import { useCart } from "../../utils/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import MobileBuyBlock from "../../Components/BuySection/MobileBuyBlock";
import AllBuyBlock from "../../Components/BuySection/AllBuyBlock";
import { getProductType, normalizeCatalogProduct } from "../../utils/productImages";

const ITEMS_PER_PAGE = 15;

const BuyBlock = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authToken } = useAuth();
  const { refreshCartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get("search") || "");
  const [allProducts, setAllProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedKind, setSelectedKind] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const sideBarKinds = [
    { name: "Seasonal", icon: <FaSeedling className="text-orange" /> },
    { name: "Daily", icon: <FaShoppingBasket className="text-orange" /> },
  ];
  const sideBarCategory = [
    { name: "Vegetables", icon: <FaCarrot className="text-orange" /> },
    { name: "Fruits", icon: <FaAppleAlt className="text-orange" /> },
    { name: "Nuts", icon: <FaLeaf className="text-orange" /> },
    { name: "Dairy", icon: <FaFish className="text-orange" /> },
    { name: "Spices", icon: <FaPepperHot className="text-orange" /> },
    { name: "Pulses", icon: <FaSeedling className="text-orange" /> },
  ];

  const GetProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const limit = 100;
      const response = await axios.get("/market/get-items", {
        params: { page: 1, limit },
        timeout: 60000,
      });
      const firstPage = response.data.items || [];
      const totalPages = Math.max(
        Number(response.data.pages) || 1,
        Math.ceil((Number(response.data.total) || firstPage.length) / limit)
      );
      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          axios.get("/market/get-items", {
            params: { page: index + 2, limit },
            timeout: 60000,
          })
        )
      );
      const allItems = firstPage
        .concat(...remainingPages.map((page) => page.data.items || []))
        .map((product) => ({
          ...normalizeCatalogProduct(product),
          itemType: getProductType(product),
        }));
      setAllProducts(allItems);
    } catch (err) {
      console.error("Failed to fetch farmer produce: ", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => setQuantity(prev => Math.max(1, prev + change));

  const AddToCart = async (product, qty = 1) => {
    const item = { id: product._id, quantity: qty };
    try {
      await axios.post("/user/buy-item", item, { headers: { Authorization: `Bearer ${authToken}` } });
      setAddedToCart(true);
      refreshCartCount();
      setTimeout(() => {
        setAddedToCart(false);
        closeModal();
      }, 1200);
    } catch (error) { console.error("Failed to add item to cart: ", error); alert("Failed to add item to cart."); }
  };

  const openModal = (product) => { setSelectedProduct(product); setModal(true); setAddedToCart(false); };
  const closeModal = () => { setModal(false); setQuantity(1); setAddedToCart(false); setTimeout(() => { setSelectedProduct(null); setQuantity(1); }, 300); };

  // Debounce search input
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || null);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;
    if (selectedCategory) filtered = filtered.filter(p => p.itemCategory === selectedCategory);
    if (selectedKind) filtered = filtered.filter(p => p.itemType === selectedKind);
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.itemName.toLowerCase().includes(term) ||
        p.itemCategory.toLowerCase().includes(term) ||
        (p.seller?.name || "").toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [allProducts, selectedCategory, selectedKind, debouncedSearch]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedKind, debouncedSearch]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const updateSearch = (value) => {
    setSearchTerm(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) nextParams.set("search", value.trim());
    else nextParams.delete("search");
    setSearchParams(nextParams, { replace: true });
  };

  const updateCategory = (value) => {
    setSelectedCategory(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("category", value);
    else nextParams.delete("category");
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => { GetProducts(); }, []);

  return (
    <div className="w-full min-h-screen bg-cream px-4 sm:px-6 md:px-8 lg:px-10 py-10 overflow-x-hidden">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-muted font-medium">Loading fresh produce...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-cream-dark">
          <FaBoxOpen size={48} className="text-orange/30 mb-4" />
          <p className="text-dark font-serif text-xl font-bold mb-1">Something went wrong</p>
          <p className="text-muted text-sm mb-5">{error}</p>
          <button onClick={GetProducts} className="px-6 py-2.5 bg-orange text-white rounded-xl font-semibold text-sm hover:bg-orange-hover transition-colors shadow-sm">
            Try Again
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      <AnimatePresence>
        {modal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto z-50"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Close button */}
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-cream hover:bg-orange hover:text-white transition-colors z-10">
                <ImCross size={10} />
              </button>

              <div className="p-5">
                {/* Product main */}
                <div className="flex items-start gap-4">
                  <div className="h-28 w-28 bg-cream rounded-xl overflow-hidden shrink-0">
                    <img
                      src={selectedProduct.itemImage}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.style.visibility = "hidden";
                      }}
                      alt={selectedProduct.itemName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-serif text-xl font-bold text-dark">{selectedProduct.itemName}</h2>
                    <p className="text-sm text-muted mt-1 flex items-center gap-1.5">
                      <FaStore className="text-orange" size={10} />
                      <span className="font-medium text-dark">{selectedProduct.seller?.name}</span>
                    </p>
                    <p className="text-lg font-bold text-orange mt-2">₹{selectedProduct.itemPrice} <span className="text-xs text-muted font-normal">/ {selectedProduct.itemUnit?.unit}</span></p>
                    <p className="text-xs text-muted mt-1">Stock: {selectedProduct.quantity} available</p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 flex items-center justify-center bg-cream border border-cream-dark rounded-lg hover:border-orange hover:text-orange transition-colors">
                        <FaMinus size={9} />
                      </button>
                      <span className="w-8 text-center font-bold text-dark">{quantity}</span>
                      <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 flex items-center justify-center bg-cream border border-cream-dark rounded-lg hover:border-orange hover:text-orange transition-colors">
                        <FaPlus size={9} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={() => AddToCart(selectedProduct, quantity)}
                  disabled={addedToCart}
                  className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
                    addedToCart
                      ? "bg-green-500 text-white"
                      : "bg-orange text-white hover:bg-orange-hover"
                  }`}
                >
                  {addedToCart ? (
                    <><FaStar size={13} /> Added to Cart!</>
                  ) : (
                    <><FaCartPlus size={14} /> Add to Cart — ₹{(selectedProduct.itemPrice * quantity)}</>
                  )}
                </button>
              </div>

              {/* Other seller options */}
              {allProducts.filter(p => p.itemName.toLowerCase() === selectedProduct.itemName.toLowerCase() && p._id !== selectedProduct._id).length > 0 && (
                <div className="border-t border-cream-dark p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Other Sellers</p>
                  <div className="space-y-2.5">
                    {allProducts.filter(p => p.itemName.toLowerCase() === selectedProduct.itemName.toLowerCase() && p._id !== selectedProduct._id).slice(0, 3).map(product => (
                      <div key={product._id} className="flex items-center bg-cream rounded-xl p-3 border border-cream-dark hover:border-orange/30 transition-colors">
                        <img
                          src={product.itemImage}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.style.visibility = "hidden";
                          }}
                          alt={product.itemName}
                          className="h-12 w-12 object-cover rounded-lg bg-white shrink-0"
                        />
                        <div className="flex-1 px-3 min-w-0">
                          <p className="font-semibold text-dark text-xs truncate">{product.seller?.name}</p>
                          <p className="text-orange text-xs font-bold">₹{product.itemPrice}/{product.itemUnit?.unit}</p>
                          <p className="text-[10px] text-muted">Stock: {product.quantity}</p>
                        </div>
                        <button onClick={() => { setSelectedProduct(product); setQuantity(1); setAddedToCart(false); }} className="px-3 py-1.5 bg-dark text-white rounded-lg text-xs font-semibold hover:bg-orange transition-colors shrink-0">
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!loading && !error && (
        <>
          {/* Section Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange/10 rounded-full text-orange text-xs font-semibold mb-3">
              <FaSeedling size={12} /> Browse & Shop
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-dark">Fresh Produce from Local Farmers</h2>
            <p className="text-muted text-sm mt-2 max-w-lg mx-auto">Handpicked items from verified farmers within 30km of you</p>
          </div>

          {/* Main Content Layouts */}
          <div className="hidden lg:block w-full">
            <AllBuyBlock
              products={paginatedProducts}
              openModal={openModal}
              sideBarKinds={sideBarKinds}
              sideBarCategory={sideBarCategory}
              setSelectedKind={setSelectedKind}
              setSelectedCategory={updateCategory}
              selectedKind={selectedKind}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={updateSearch}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              goToPage={goToPage}
            />
          </div>
          <div className="lg:hidden w-full">
            <MobileBuyBlock
              products={paginatedProducts}
              openModal={openModal}
              sideBarKinds={sideBarKinds}
              sideBarCategory={sideBarCategory}
              setSelectedKind={setSelectedKind}
              setSelectedCategory={updateCategory}
              selectedKind={selectedKind}
              selectedCategory={selectedCategory}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              goToPage={goToPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BuyBlock;
