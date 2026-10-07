import React from "react";
import { BsCart4 } from "react-icons/bs";
import { FaSearch, FaLeaf, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AllBuyBlock = ({
  products,
  openModal,
  sideBarKinds,
  sideBarCategory,
  setSelectedKind,
  setSelectedCategory,
  selectedKind,
  selectedCategory,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  totalItems,
  goToPage,
}) => {
  const pageNumbers = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <div className="flex w-full gap-6 mt-8">
      {/* Sidebar */}
      <div className="w-72 shrink-0 bg-white rounded-2xl border border-cream-dark shadow-sm p-5 self-stretch sticky top-24">
        {/* Search */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" />
          <input
            type="text"
            placeholder="Search produce or farmer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-dark bg-cream text-dark text-xs placeholder-muted focus:outline-none focus:border-orange transition-colors"
          />
        </div>

        {/* Kind filter */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5 px-1">Type</p>
        <div className="space-y-0.5 mb-4">
          {sideBarKinds.map((kind) => (
            <div
              key={kind.name}
              onClick={() => setSelectedKind(kind.name === selectedKind ? null : kind.name)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all text-xs font-medium ${
                selectedKind === kind.name
                  ? "bg-dark text-white"
                  : "text-muted hover:text-dark hover:bg-cream"
              }`}
            >
              <span className={`text-sm ${selectedKind === kind.name ? "text-orange" : ""}`}>{kind.icon}</span>
              {kind.name}
            </div>
          ))}
        </div>

        <div className="h-px bg-cream-dark mb-4" />

        {/* Category filter */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1.5 px-1">Category</p>
        <div className="space-y-0.5">
          {sideBarCategory.map((category) => (
            <div
              key={category.name}
              onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all text-xs font-medium ${
                selectedCategory === category.name
                  ? "bg-dark text-white"
                  : "text-muted hover:text-dark hover:bg-cream"
              }`}
            >
              <span className={`text-sm ${selectedCategory === category.name ? "text-orange" : ""}`}>{category.icon}</span>
              {category.name}
            </div>
          ))}
        </div>

        {/* Clear filters */}
        {(selectedKind || selectedCategory || searchTerm) && (
          <button
            onClick={() => { setSelectedKind(null); setSelectedCategory(null); setSearchTerm(""); }}
            className="mt-4 w-full py-2 rounded-xl border border-cream-dark text-xs text-muted hover:text-dark hover:border-dark transition-colors font-medium"
          >
            Clear Filters
          </button>
        )}

        {/* Active filter badges */}
        <div className="mt-auto pt-4">
          <div className="h-px bg-cream-dark mb-3" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 px-1">Active Filters</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange/10 text-orange text-[10px] font-semibold rounded-lg">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)} className="ml-0.5 hover:text-orange-hover">&times;</button>
              </span>
            )}
            {selectedKind && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange/10 text-orange text-[10px] font-semibold rounded-lg">
                {selectedKind}
                <button onClick={() => setSelectedKind(null)} className="ml-0.5 hover:text-orange-hover">&times;</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange/10 text-orange text-[10px] font-semibold rounded-lg truncate max-w-[140px]">
                &ldquo;{searchTerm}&rdquo;
                <button onClick={() => setSearchTerm("")} className="ml-0.5 hover:text-orange-hover">&times;</button>
              </span>
            )}
            {!selectedCategory && !selectedKind && !searchTerm && (
              <span className="text-[10px] text-muted">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid + Pagination */}
      <div className="flex-1 min-w-0">
        {/* Results count */}
        <p className="text-xs text-muted mb-3">
          Showing {products.length} of {totalItems} items
          {totalPages > 1 && ` — Page ${currentPage} of ${totalPages}`}
        </p>

        {!products.length ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <FaLeaf size={32} className="text-orange/40" />
            <p className="text-dark font-serif text-xl font-bold">No produce found</p>
            <p className="text-muted text-sm">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <>
            {/* 5 columns = 3 rows × 5 cols = 15 items per page */}
            <div className="grid grid-cols-5 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl border border-cream-dark shadow-sm hover:shadow-lg hover:border-orange/30 transition-all duration-200 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="h-28 w-full bg-cream overflow-hidden">
                    <img
                      src={product.itemImage || undefined}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.style.visibility = "hidden";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      alt={product.itemName}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <h3 className="font-serif text-[11px] font-bold text-dark truncate">{product.itemName}</h3>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 text-[8px] font-semibold">
                      {product.itemType}
                    </span>
                    <p className="text-orange font-bold text-[10px] mt-0.5">₹{product.itemPrice}/{product.itemUnit?.unit}</p>
                    <p className="text-[9px] text-muted mt-0.5 truncate">By {product.seller?.name}</p>
                    <p className="text-[9px] text-muted">Stock: {product.quantity}</p>

                    <button
                      onClick={() => openModal(product)}
                      className="mt-1.5 w-full flex items-center justify-center gap-1 py-1.5 bg-orange text-white rounded-lg text-[9px] font-semibold hover:bg-orange-hover transition-colors shadow-sm"
                    >
                      <BsCart4 size={10} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-6">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-cream-dark bg-white text-dark hover:bg-orange hover:text-white hover:border-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft size={10} />
                </button>

                {startPage > 1 && (
                  <>
                    <button onClick={() => goToPage(1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-cream-dark bg-white text-dark text-xs font-medium hover:bg-orange hover:text-white transition-colors">1</button>
                    {startPage > 2 && <span className="text-muted text-xs">...</span>}
                  </>
                )}

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-orange text-white shadow-md"
                        : "border border-cream-dark bg-white text-dark hover:bg-orange hover:text-white hover:border-orange"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && <span className="text-muted text-xs">...</span>}
                    <button onClick={() => goToPage(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-cream-dark bg-white text-dark text-xs font-medium hover:bg-orange hover:text-white transition-colors">{totalPages}</button>
                  </>
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-cream-dark bg-white text-dark hover:bg-orange hover:text-white hover:border-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FaChevronRight size={10} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBuyBlock;
