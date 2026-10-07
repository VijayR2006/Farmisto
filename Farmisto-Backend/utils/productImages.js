const LEGACY_CATEGORY_IMAGES = new Set([
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
  "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400",
  "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400",
  "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400",
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400",
  "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400",
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
};

const PRODUCTS_WITHOUT_VERIFIED_IMAGES = new Set([
  "fox nuts (makhana)",
  "khoya",
  "coriander powder",
]);

const resolvedImages = new Map();

function normalizeImageUrl(imageUrl) {
  if (!imageUrl || !imageUrl.includes("thumb.wikimedia.org/wikipedia/commons/thumb/")) {
    return imageUrl;
  }

  const path = imageUrl.split("thumb.wikimedia.org/wikipedia/commons/thumb/")[1];
  const segments = path.split("/");
  segments.pop();
  return `https://upload.wikimedia.org/wikipedia/commons/${segments.join("/").split("?")[0]}`;
}

function normalizeUploadImageUrl(imageUrl) {
  return imageUrl.replace(/\/960px-([^/]+)$/, "/$1");
}

function getCuratedProductImage(productName) {
  const normalizedName = String(productName || "").trim().toLowerCase();
  const singularName = normalizedName.endsWith("oes")
    ? normalizedName.replace(/es$/, "")
    : normalizedName.replace(/s$/, "");
  return PRODUCT_IMAGES[normalizedName] || PRODUCT_IMAGES[singularName];
}

function getProductImage(itemName) {
  return getCuratedProductImage(itemName) || null;
}

function getDisplayProductImage(itemName, savedImage) {
  const curatedImage = getCuratedProductImage(itemName);
  if (curatedImage) return curatedImage;

  const normalizedName = String(itemName || "").trim().toLowerCase();
  if (PRODUCTS_WITHOUT_VERIFIED_IMAGES.has(normalizedName) || isGenericProductImage(savedImage)) {
    return "";
  }

  return savedImage;
}

function isGenericProductImage(imageUrl) {
  if (!imageUrl) return true;
  const source = String(imageUrl);
  return LEGACY_CATEGORY_IMAGES.has(source) ||
    LEGACY_CATEGORY_IMAGES.has(source.split("?")[0]) ||
    /loremflickr|via\.placeholder|thumb\.wikimedia\.org/i.test(source);
}

async function resolveProductImage(itemName) {
  const productName = String(itemName || "").trim();
  if (resolvedImages.has(productName)) return resolvedImages.get(productName);

  const curatedImage = getCuratedProductImage(productName);
  const image = curatedImage;
  if (!image) {
    throw new Error(`No real product photo is mapped for: ${productName}`);
  }
  resolvedImages.set(productName, image);
  return image;
}

async function resolveProductImages(itemNames) {
  const images = {};
  for (const itemName of [...new Set(itemNames)]) {
    images[itemName] = getCuratedProductImage(itemName) || null;
  }
  return images;
}

module.exports = {
  getProductImage,
  getDisplayProductImage,
  resolveProductImage,
  resolveProductImages,
  normalizeImageUrl,
  normalizeUploadImageUrl,
  isGenericProductImage,
  LEGACY_CATEGORY_IMAGES,
  PRODUCT_IMAGES,
};