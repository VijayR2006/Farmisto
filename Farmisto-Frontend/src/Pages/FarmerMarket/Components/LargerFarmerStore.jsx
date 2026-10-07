import React, { useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { FaCarrot, FaFish, FaLeaf, FaMinus, FaPepperHot, FaPlus, FaSeedling } from "react-icons/fa6";
import { FaAppleAlt, FaShoppingBasket } from "react-icons/fa";

const LargerFarmerStore = ({ products, addToCart, handleQuantityChange, quantities }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", icon: <FaShoppingBasket /> },
    { name: "Fruits", icon: <FaAppleAlt /> },
    { name: "Vegetables", icon: <FaCarrot /> },
    { name: "Herbs", icon: <FaLeaf /> },
    { name: "Spices", icon: <FaPepperHot /> },
    { name: "Grains", icon: <FaSeedling /> },
    { name: "Seafood", icon: <FaFish /> },
  ];


  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) =>
          product.itemCategory?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="w-full flex flex-row gap-6 p-6 ">
      {/* Vertical Category Sidebar */}
      <div className="w-1/4 bg-gradient-to-br from-[#fff6df] via-[#fcebc3] to-[#f9dd97] rounded-2xl shadow-md p-4 flex flex-col gap-3">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.name)}
            className={`h-12 flex items-center px-4 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedCategory === category.name
                ? "bg-amber-300 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            }`}
          >
            <div className="text-xl mr-3">{category.icon}</div>
            <p className="text-md font-semibold">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="w-3/4">
        {!filteredProducts.length ? (
          <div className="flex justify-center items-center h-64">
            <img
              src="https://www.breathearomatherapy.com/assets/images/global/no-product.png"
              alt="No Products"
              className="w-full max-w-[300px] h-auto object-contain"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-gradient-to-br from-amber-50 via-amber-n100 to-amber-200 border border-amber-100 rounded-2xl shadow-sm p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:shadow-amber-200"
              >
                <img
                  src={product.itemImage}
                  alt={product.itemName}
                  className="w-36 h-36 object-cover mb-4 rounded-md"
                />
                <h3 className="text-lg font-bold text-amber-800 mb-2 truncate w-full">
                  {product.itemName}
                </h3>
                <p className="text-md text-amber-600 mb-4">
                  Price: ₹{product.itemPrice}/{product.itemUnit.unit}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleQuantityChange(product._id, -1)}
                    className="bg-amber-100 p-2 rounded-full hover:bg-amber-200"
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 border border-amber-800 rounded-md text-amber-800 text-md">
                    {quantities[product._id] || 1}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(product._id, 1)}
                    className="bg-amber-100 p-2 rounded-full hover:bg-amber-200"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-md"
                >
                  <BsCart4 className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LargerFarmerStore;