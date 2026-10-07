const LEGACY_CATEGORY_IMAGES = new Set([
  "https://images.unsplash.com/photo-1540420773420-3366772f4999",
  "https://images.unsplash.com/photo-1619566636858-adf3ef46400b",
  "https://images.unsplash.com/photo-1599940824399-b87987ceb72a",
  "https://images.unsplash.com/photo-1628088062854-d1870b4553da",
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d",
  "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082",
]);

const PRODUCT_IMAGES = {
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=640&h=480&fit=crop",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=640&h=480&fit=crop",
  grapes: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=640&h=480&fit=crop",
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=640&h=480&fit=crop",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=640&h=480&fit=crop",
  onion: "https://www.themealdb.com/images/ingredients/Onion.png",
  carrot: "https://www.themealdb.com/images/ingredients/Carrot.png",
  cabbage: "https://www.themealdb.com/images/ingredients/Cabbage.png",
  capsicum: "https://www.themealdb.com/images/ingredients/Green%20Pepper.png",
  cauliflower: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=640&h=480&fit=crop",
  spinach: "https://www.themealdb.com/images/ingredients/Spinach.png",
  brinjal: "https://www.themealdb.com/images/ingredients/Eggplant.png",
  papaya: "https://www.themealdb.com/images/ingredients/Papaya.png",
  guava: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Fresh_Guava.jpg",
  pomegranate: "https://www.themealdb.com/images/ingredients/Pomegranate.png",
  orange: "https://www.themealdb.com/images/ingredients/Orange.png",
  watermelon: "https://upload.wikimedia.org/wikipedia/commons/7/70/Fresh_Watermelons_Stacked.jpg",
  mango: "https://www.themealdb.com/images/ingredients/Mango.png",
  litchi: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Lychee_fruits_and_seed.jpg",
  dates: "https://upload.wikimedia.org/wikipedia/commons/2/21/Dates_in_Illorin%2C_Kwara_state.jpg",
  almonds: "https://www.themealdb.com/images/ingredients/Almonds.png",
  "chia seeds": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Mexican_chia_seeds_%281%29.jpg",
  milk: "https://www.themealdb.com/images/ingredients/Milk.png",
  paneer: "https://www.themealdb.com/images/ingredients/Paneer.png",
  "red chili": "https://upload.wikimedia.org/wikipedia/commons/3/35/Red_Hot_Chilli_Pepper_-_geograph.org.uk_-_4789925.jpg",
  "mustard seeds": "https://www.themealdb.com/images/ingredients/Mustard.png",
  cinnamon: "https://upload.wikimedia.org/wikipedia/commons/d/de/Cinnamomum_verum_spices.jpg",
  cardamom: "https://www.themealdb.com/images/ingredients/Cardamom.png",
  "black pepper": "https://www.themealdb.com/images/ingredients/Black%20Pepper.png",
  "cumin seeds": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Cumin.JPG",
  "masoor dal": "https://www.themealdb.com/images/ingredients/Lentils.png",
  "chana dal": "https://www.themealdb.com/images/ingredients/Chickpeas.png",
  "toor dal": "https://www.themealdb.com/images/ingredients/Toor%20Dal.png",
  "horse gram": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Horse_Gram_Seeds.jpg/960px-Horse_Gram_Seeds.jpg",
  "urad dal": "https://www.themealdb.com/images/ingredients/Lentils.png",
  "moong dal": "https://upload.wikimedia.org/wikipedia/commons/5/50/Munggo_seeds_being_dried_%28Bona_Rae_Villarta%29_-_Flickr.jpg",
  turmeric: "https://www.themealdb.com/images/ingredients/Turmeric.png",
  cashews: "https://www.themealdb.com/images/ingredients/Cashews.png",
  pistachios: "https://www.themealdb.com/images/ingredients/Pistachio.png",
  raisins: "https://www.themealdb.com/images/ingredients/Raisins.png",
  peanuts: "https://www.themealdb.com/images/ingredients/Peanuts.png",
  "fenugreek seeds": "https://www.themealdb.com/images/ingredients/Fenugreek.png",
  "black eyed peas": "https://www.themealdb.com/images/ingredients/Black_Eyed_Peas.png",
  "green gram": "https://upload.wikimedia.org/wikipedia/commons/5/50/Munggo_seeds_being_dried_%28Bona_Rae_Villarta%29_-_Flickr.jpg",
  rajma: "https://www.themealdb.com/images/ingredients/Kidney%20Beans.png",
  curd: "https://www.themealdb.com/images/ingredients/Yogurt.png",
  butter: "https://www.themealdb.com/images/ingredients/Butter.png",
  ghee: "https://www.themealdb.com/images/ingredients/Ghee.png",
  cheese: "https://www.themealdb.com/images/ingredients/Cheese.png",
  buttermilk: "https://www.themealdb.com/images/ingredients/Buttermilk.png",
  cream: "https://www.themealdb.com/images/ingredients/Cream.png",
  lassi: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Lassi-MB53.jpg",
  "flax seeds": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Golden_Flax_Seeds_%288593210803%29.jpg",
  "lady finger": "https://upload.wikimedia.org/wikipedia/commons/3/36/Okro_or_Okra_Shaded_For_Sale_At_A_Local_Market.jpg",
  walnuts: "https://www.themealdb.com/images/ingredients/Walnuts.png",
  cloves: "https://www.themealdb.com/images/ingredients/Cloves.png",
  chickpeas: "https://www.themealdb.com/images/ingredients/Chickpeas.png",
  "fox nuts (makhana)": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=640&h=480&fit=crop",
  khoya: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=640&h=480&fit=crop",
  "coriander powder": "https://www.themealdb.com/images/ingredients/Coriander.png",
};

export const CATEGORY_FALLBACK_IMAGES = {
  Vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=640&h=480&fit=crop",
  Fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=640&h=480&fit=crop",
  Dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=640&h=480&fit=crop",
  Nuts: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=640&h=480&fit=crop",
  Spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=640&h=480&fit=crop",
  Pulses: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=640&h=480&fit=crop",
};

export const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&h=480&fit=crop";

export const getCategoryFallbackImage = (category) => {
  return CATEGORY_FALLBACK_IMAGES[category] || DEFAULT_PRODUCT_IMAGE;
};

const getCuratedProductImage = (productName) => {
  const normalizedName = String(productName || "").trim().toLowerCase();
  const singularName = normalizedName.endsWith("oes")
    ? normalizedName.replace(/es$/, "")
    : normalizedName.replace(/s$/, "");
  return PRODUCT_IMAGES[normalizedName] || PRODUCT_IMAGES[singularName];
};

export const getDisplayProductImage = (itemName, savedImage, category) => {
  const curatedImage = getCuratedProductImage(itemName);
  if (curatedImage) return curatedImage;

  if (savedImage && !isGenericProductImage(savedImage)) {
    return savedImage;
  }

  return getCategoryFallbackImage(category);
};

const isGenericProductImage = (imageUrl) => (
  !imageUrl ||
  LEGACY_CATEGORY_IMAGES.has(String(imageUrl).split("?")[0]) ||
  /loremflickr|via\.placeholder|thumb\.wikimedia\.org/i.test(String(imageUrl))
);

export const normalizeCatalogProduct = (product) => {
  const productImage = getDisplayProductImage(product.itemName, product.itemImage, product.itemCategory);
  return { ...product, itemImage: productImage };
};

const SEASONAL_MONTHS = {
  "Vegetables:carrot": [10, 11, 12, 1, 2],
  "Vegetables:spinach": [10, 11, 12, 1, 2],
  "Vegetables:cabbage": [10, 11, 12, 1, 2],
  "Vegetables:cauliflower": [10, 11, 12, 1, 2],
  "Fruits:orange": [11, 12, 1, 2, 3],
  "Fruits:guava": [7, 8, 9, 10, 11, 12, 1, 2],
  "Fruits:pomegranate": [9, 10, 11, 12, 1, 2],
  "Fruits:grape": [12, 1, 2, 3, 4],
  "Fruits:mango": [4, 5, 6, 7],
  "Fruits:watermelon": [3, 4, 5, 6],
  "Fruits:litchi": [5, 6, 7],
};

export const getProductType = (product, date = new Date()) => {
  const category = String(product.itemCategory || "").trim();
  const name = String(product.itemName || "")
    .trim()
    .toLowerCase()
    .replace(/s$/, "");
  const seasonalMonths = SEASONAL_MONTHS[`${category}:${name}`];
  if (!seasonalMonths) {
    return String(product.itemType || "").trim().toLowerCase() === "seasonal"
      ? "Seasonal"
      : "Daily";
  }

  const month = Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "numeric",
  }).format(date));
  return seasonalMonths.includes(month) ? "Seasonal" : "Daily";
};
