import React, { useEffect, useState } from "react";
import moment from "moment";
import { styled } from "@mui/material/styles";
import { Stack, Pagination } from "@mui/material";
import SideNav from "../../Dash/SideNav";
import { useAuth } from "../../utils/Auth";
import axios from "../../utils/axios";
import { MdDelete } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

const StyledPagination = styled(Pagination)(() => ({
  "& .MuiPaginationItem-root": {
    color: "#1A1A1A",
    "&:hover": { backgroundColor: "#EDE6D4" },
    "&.Mui-selected": { backgroundColor: "#E8621A", color: "white", "&:hover": { backgroundColor: "#d05515" } },
  },
}));

const TABS = ["All Discounts", "Active Discounts", "Expired Discounts"];

const Discounts = () => {
  const { authToken } = useAuth();
  const [listPromos, setListPromos] = useState([]);
  const [productData, setProductData] = useState([]);
  const [activeTab, setActiveTab] = useState("All Discounts");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const GetPromos = async () => {
    try {
      const response = await axios.get("/promo/list-promos", { headers: { Authorization: `Bearer ${authToken}` } });
      setListPromos(response.data.promoCodes);
    } catch (error) { console.error("Failed to fetch promos: ", error); }
  };

  const getAllItems = async () => {
    try {
      const response = await axios.get("/market/get-items-farmer", { headers: { Authorization: `Bearer ${authToken}` } });
      setProductData(response.data.items);
    } catch (error) { console.error("Failed to fetch items: ", error); }
  };

  const getProductDetails = (itemId) => productData.find(p => p?._id === itemId);

  const filteredPromos = listPromos.filter(p => p.code.toLowerCase().includes(searchQuery.toLowerCase()));
  const paginatedPromos = filteredPromos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDeleteDiscount = async (id) => {
    try {
      await axios.delete("/promo/del-promo/" + id, { headers: { Authorization: `Bearer ${authToken}` } });
      setListPromos(prev => prev.filter(p => p._id !== id));
    } catch (error) { console.error(error); }
  };

  useEffect(() => { GetPromos(); getAllItems(); }, [authToken]);

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <SideNav />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-cream-dark/60 shrink-0">
          <div>
            <p className="text-xs text-muted font-medium">Farmer Portal</p>
            <h2 className="font-serif text-lg font-bold text-dark">Discounts</h2>
          </div>
          <span className="px-4 py-2 bg-cream rounded-xl text-sm font-semibold text-dark border border-cream-dark">
            {listPromos.length} promo codes
          </span>
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
              placeholder="Search promo codes..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-cream-dark bg-white text-dark placeholder-muted focus:outline-none focus:border-orange text-sm"
            />
          </div>

          {/* Discount Cards */}
          <div className="space-y-3">
            {paginatedPromos.map((discount, i) => {
              const product = getProductDetails(discount.item);
              if (!product) return null;
              const discountedPrice = ((product.itemPrice * (100 - discount.discountPercentage)) / 100).toFixed(2);

              return (
                <div key={i} className="bg-white rounded-2xl p-5 border border-cream-dark/50 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-2xl bg-cream overflow-hidden shrink-0">
                    <img src={product.itemImage} alt={product.itemName} className="w-full h-full object-contain" />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base font-bold text-dark truncate">{product.itemName}</p>
                    <p className="text-xs text-muted mt-0.5">ID: #{discount._id.slice(-8)}</p>
                    <span className="mt-2 inline-block px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold tracking-wider">{discount.code}</span>
                  </div>

                  {/* Dates */}
                  <div className="text-sm text-muted space-y-1 shrink-0">
                    <p>Issued: <span className="text-dark font-medium">{moment(discount.createdAt).format("MMM D, YYYY")}</span></p>
                    <p>Expires: <span className="text-dark font-medium">{moment(discount.expiryDate).format("MMM D, YYYY")}</span></p>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <p className="text-sm text-muted line-through">₹{product.itemPrice}</p>
                    <p className="text-base font-bold text-orange">₹{discountedPrice}</p>
                    <p className="text-xs text-muted">{discount.discountPercentage}% off</p>
                  </div>

                  {/* Uses */}
                  <div className="text-sm shrink-0">
                    <p className="text-muted text-xs">Uses Left</p>
                    <p className="font-bold text-dark text-base">{discount.usageLimit - discount.usedCount}</p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteDiscount(discount._id)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors shrink-0"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {filteredPromos.length > itemsPerPage && (
            <div className="flex justify-center mt-8">
              <StyledPagination count={Math.ceil(filteredPromos.length / itemsPerPage)} page={currentPage} onChange={(_, v) => setCurrentPage(v)} />
            </div>
          )}

          {paginatedPromos.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif text-xl font-bold text-dark mb-2">No Discounts Found</p>
              <p className="text-muted text-sm">Add promo codes to boost your product visibility.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discounts;
