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

function getIndiaMonth(date = new Date()) {
  if (Number.isInteger(date) && date >= 1 && date <= 12) return date;
  return Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "numeric",
  }).format(date));
}

function getProductType(product, date = new Date()) {
  const category = String(product?.itemCategory || product?.category || "").trim();
  const name = String(product?.itemName || product?.name || "")
    .trim()
    .toLowerCase()
    .replace(/s$/, "");
  const seasonalMonths = SEASONAL_MONTHS[`${category}:${name}`];
  if (seasonalMonths) {
    return seasonalMonths.includes(getIndiaMonth(date)) ? "Seasonal" : "Daily";
  }

  const declaredType = String(product?.itemType || "").trim().toLowerCase();
  return declaredType === "seasonal" ? "Seasonal" : "Daily";
}

module.exports = { getProductType };
