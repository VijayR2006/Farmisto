import React, { useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { FaAppleAlt, FaShoppingBasket } from "react-icons/fa";
import { FaCarrot, FaFish, FaLeaf, FaPepperHot, FaSeedling } from "react-icons/fa6";

const MobileFarmerStore = ({ products, addToCart, handleQuantityChange, quantities }) => {
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
    <div className="w-full p-4 bg-gradient-to-b from-emerald-50 to-white">
      {/* Horizontal Category Selection */}
      <div className="flex overflow-x-auto gap-3 pb-3 mb-4">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.name)}
            className={`flex-shrink-0 h-10 w-28 rounded-xl p-2 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              selectedCategory === category.name
                ? "bg-emerald-300 text-white"
                : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            }`}
          >
            <div className="text-md">{category.icon}</div>
            <p className="text-sm font-semibold">{category.name}</p>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="w-full">
        {!filteredProducts.length ? (
          <div className="flex justify-center items-center h-48">
            <img
              src="https://www.breathearomatherapy.com/assets/images/global/no-product.png"
              alt="No Products"
              className="w-full max-w-[200px] h-auto object-contain"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="h-44 w-full bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-300 cursor-pointer overflow-hidden relative transition-all duration-300"
              >
                <div className="h-[55%] w-full flex justify-center items-center p-2">
                  <img
                    src={product.itemImage}
                    className="object-contain h-full w-full"
                    alt={product.itemName}
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-semibold text-emerald-900 truncate">
                    {product.itemName}
                  </h3>
                  <span className="text-xs font-medium text-emerald-800">
                    ₹{product.itemPrice}/{product.itemUnit.unit}
                  </span>
                </div>
                <div
                  onClick={() => addToCart(product)}
                  className="absolute bottom-1 right-1 p-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-md"
                >
                  <BsCart4 className="text-white" size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileFarmerStore;