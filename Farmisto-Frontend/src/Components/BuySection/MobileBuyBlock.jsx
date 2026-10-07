import React, { useState } from "react";
import { BsCart4, BsChevronDown } from "react-icons/bs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MobileBuyBlock = ({ products, openModal, sideBarKinds, sideBarCategory, setSelectedKind, setSelectedCategory, selectedKind, selectedCategory, currentPage, totalPages, totalItems, goToPage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const allOptions = [
    ...sideBarKinds.map(kind => ({ ...kind, type: "kind" })),
    ...sideBarCategory.map(category => ({ ...category, type: "category" })),
  ];

  const handleSelection = (option) => {
    if (option.type === "kind") {
      setSelectedKind(selectedKind === option.name ? null : option.name);
    } else {
      setSelectedCategory(selectedCategory === option.name ? null : option.name);
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full min-h-screen p-3 rounded-xl bg-gradient-to-b from-cream to-white">
      {/* Filter Dropdown */}
      <div className="relative mb-3">
        <div
          className="w-full h-10 bg-white rounded-xl flex items-center justify-between px-4 shadow-sm border border-cream-dark cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <p className="text-sm font-semibold text-dark">
            {selectedKind || selectedCategory || "All Categories"}
          </p>
          <BsChevronDown className={`text-muted transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} size={16} />
        </div>
        {isDropdownOpen && (
          <div className="absolute top-12 left-0 w-full max-h-60 bg-white overflow-y-auto rounded-xl shadow-lg border border-cream-dark z-10">
            {allOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelection(option)}
                className={`h-10 w-full flex items-center px-4 hover:bg-cream cursor-pointer text-sm font-medium ${
                  (option.type === "kind" && selectedKind === option.name) ||
                  (option.type === "category" && selectedCategory === option.name)
                    ? "bg-orange/10 text-orange"
                    : "text-dark"
                }`}
              >
                <span className="mr-2 text-base">{option.icon}</span>
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-[10px] text-muted mb-2 px-0.5">
        {totalItems} items
        {totalPages > 1 && ` — Page ${currentPage}/${totalPages}`}
      </p>

      {/* Product Grid */}
      <div className="w-full">
        {!products.length ? (
          <div className="flex justify-center items-center h-48">
            <div className="text-center">
              <p className="text-dark font-serif text-lg font-bold">No produce found</p>
              <p className="text-muted text-xs mt-1">Try adjusting your filters.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl border border-cream-dark shadow-sm hover:shadow-md cursor-pointer overflow-hidden relative transition-all duration-200"
              >
                <div className="h-28 w-full bg-cream overflow-hidden">
                  <img
                    src={product.itemImage || undefined}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.style.visibility = "hidden";
                    }}
                    className="w-full h-full object-cover"
                    alt={product.itemName}
                  />
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-bold text-dark truncate">{product.itemName}</h3>
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 text-[8px] font-semibold">
                    {product.itemType}
                  </span>
                  <span className="text-[10px] font-semibold text-orange">
                    ₹{product.itemPrice}/{product.itemUnit?.unit}
                  </span>
                </div>
                <button
                  onClick={() => openModal(product)}
                  className="absolute bottom-2 right-2 p-1.5 bg-orange hover:bg-orange-hover rounded-lg shadow-sm transition-colors"
                >
                  <BsCart4 className="text-white" size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-cream-dark bg-white text-dark hover:bg-orange hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaChevronLeft size={10} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, idx, arr) => (
              <React.Fragment key={page}>
                {idx > 0 && page - arr[idx - 1] > 1 && <span className="text-muted text-xs">...</span>}
                <button
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-orange text-white shadow-sm"
                      : "border border-cream-dark bg-white text-dark hover:bg-orange hover:text-white"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))
          }

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-cream-dark bg-white text-dark hover:bg-orange hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileBuyBlock;
