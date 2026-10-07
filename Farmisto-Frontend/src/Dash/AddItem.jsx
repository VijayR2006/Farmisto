import React, { useState, useRef, useEffect } from "react";
import SideNav from "./SideNav";
import axios from "../utils/axios";
import { useAuth } from "../utils/Auth";
import { motion } from "framer-motion";
import { FaCarrot, FaRupeeSign, FaListAlt, FaCalendarAlt, FaWeightHanging, FaRuler, FaCamera, FaSearch } from "react-icons/fa";

const Field = ({ label, icon: Icon, children }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-semibold text-dark mb-2">
      <Icon size={14} className="text-orange shrink-0" />{label}
    </label>
    {children}
  </div>
);

const inputClass = "w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-dark text-sm placeholder-muted focus:outline-none focus:border-orange transition-colors";

const AddItem = () => {
  const { authToken } = useAuth();
  const [productData, setProductData] = useState([]);
  const [hover, setHover] = useState(false);
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [success, setSuccess] = useState(false);

  const itemName = useRef();
  const itemPrice = useRef();
  const itemCategory = useRef();
  const itemQuantity = useRef();
  const itemType = useRef();
  const itemUnit = useRef();
  const perPrice = useRef();

  const handleImageChange = (e) => { setImage(e.target.files[0]); setImageError(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) { setImageError(true); return; }
    const formData = new FormData();
    formData.append("itemName", itemName.current.value);
    formData.append("itemPrice", itemPrice.current.value);
    formData.append("itemCategory", itemCategory.current.value);
    formData.append("quantity", itemQuantity.current.value);
    formData.append("itemType", itemType.current.value);
    formData.append("unit", itemUnit.current.value);
    formData.append("itemValue", perPrice.current.value);
    formData.append("itemImage", image);
    try {
      const response = await axios.post("/market/add-item", formData, { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" } });
      setProductData(prev => [...prev, response.data.item]);
      itemName.current.value = "";
      itemPrice.current.value = "";
      itemQuantity.current.value = "";
      perPrice.current.value = "";
      itemCategory.current.value = "Category";
      itemType.current.value = "All";
      itemUnit.current.value = "kg";
      setImage(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) { console.error("Failed to add item: ", error); }
  };

  const getAllItems = async () => {
    try {
      const response = await axios.get("/market/get-items-farmer", { headers: { Authorization: `Bearer ${authToken}` } });
      setProductData(response.data.items);
    } catch (error) { console.error("Failed to fetch items: ", error); }
  };

  useEffect(() => { if (authToken) getAllItems(); }, [authToken]);

  const filteredProducts = productData.filter(p => p.itemName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      <SideNav />
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        {/* Sticky Header */}
        <div className="w-full h-16 flex items-center justify-between px-6 bg-white border-b border-cream-dark/60 shrink-0">
          <div>
            <p className="text-xs text-muted font-medium">Farmer Portal</p>
            <h2 className="font-serif text-lg font-bold text-dark">Add Produce</h2>
          </div>
          {success && (
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold">✓ Produce added!</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-6 scrollbar-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-dark mb-6">New Listing</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Produce Name" icon={FaCarrot}>
                    <input type="text" ref={itemName} className={inputClass} placeholder="e.g., Organic Tomatoes" required />
                  </Field>
                  <Field label="Total Price (₹)" icon={FaRupeeSign}>
                    <input type="number" ref={itemPrice} className={inputClass} placeholder="e.g., 500" required />
                  </Field>
                  <Field label="Category" icon={FaListAlt}>
                    <select ref={itemCategory} className={inputClass}>
                      <option value="Category">Select Category</option>
                      {["Vegetables","Fruits","Nuts","Spices","Dairy","Pulses"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Type" icon={FaCalendarAlt}>
                    <select ref={itemType} className={inputClass}>
                      <option value="All">Select Type</option>
                      <option value="Seasonal">Seasonal</option>
                      <option value="Daily">Daily</option>
                    </select>
                  </Field>
                  <Field label="Quantity" icon={FaWeightHanging}>
                    <input type="number" ref={itemQuantity} className={inputClass} placeholder="e.g., 10" required />
                  </Field>
                  <Field label="Price per Unit (₹)" icon={FaRupeeSign}>
                    <input type="number" ref={perPrice} className={inputClass} placeholder="e.g., 50" required />
                  </Field>
                  <Field label="Unit" icon={FaRuler}>
                    <select ref={itemUnit} className={inputClass}>
                      {["kg","l","ml"].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-dark mb-2">
                    <FaCamera size={14} className="text-orange" /> Product Image
                  </label>
                  <div
                    onClick={() => document.getElementById("additem-image").click()}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className="relative w-full h-36 rounded-xl border-2 border-dashed border-cream-dark bg-cream cursor-pointer flex items-center justify-center overflow-hidden transition-colors hover:border-orange"
                    style={image ? { backgroundImage: `url(${URL.createObjectURL(image)})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  >
                    {hover && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-dark/40 flex items-center justify-center">
                        <p className="text-white font-semibold text-sm">Change Image</p>
                      </motion.div>
                    )}
                    {!image && <p className="text-muted text-sm flex items-center gap-2"><FaCamera /> Click to upload image</p>}
                    <input type="file" id="additem-image" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                  {imageError && <p className="text-red-500 text-xs mt-1">Please select an image</p>}
                </div>

                <button type="submit" className="w-full py-3.5 bg-orange text-white font-semibold rounded-xl hover:bg-orange-hover transition-colors shadow-md text-sm">
                  + Add to Market
                </button>
              </form>
            </div>

            {/* Right: Product list */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-6 border border-cream-dark/50 shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-5 shrink-0">
                  <h3 className="font-serif text-xl font-bold text-dark">Your Listings</h3>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-8 pr-3 py-2 text-sm rounded-xl border border-cream-dark bg-cream focus:outline-none focus:border-orange w-36"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 scrollbar-none">
                  {filteredProducts.length > 0 ? filteredProducts.map(product => (
                    <div key={product._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream transition-colors border border-cream-dark/30">
                      <img src={product.itemImage} alt={product.itemName} className="w-14 h-14 object-cover rounded-xl shrink-0 bg-cream" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-dark text-sm truncate">{product.itemName}</p>
                        <p className="text-xs text-muted">{product.itemCategory} · {product.itemType}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-dark">₹{product.itemPrice}</p>
                        <p className="text-xs text-muted">₹{product.itemValue}/{product.ItemUnit}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                      <FaCarrot size={32} className="text-orange/40 mb-3" />
                      <p className="font-serif text-lg font-bold text-dark">No produce yet</p>
                      <p className="text-sm text-muted">Add your first item using the form.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
