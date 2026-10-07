const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require('path').join(__dirname, '.env') });

const Market = require("./models/Market");
const User = require("./models/User");
const { resolveProductImages } = require("./utils/productImages");
const { getProductType } = require("./utils/productTypes");

const CATALOG = {
  Vegetables: [
    { name: "Tomato", price: 40, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Potato", price: 25, qty: 200, unitVal: 1, unit: "kg" },
    { name: "Onion", price: 35, qty: 150, unitVal: 1, unit: "kg" },
    { name: "Carrot", price: 50, qty: 80, unitVal: 500, unit: "g" },
    { name: "Spinach", price: 30, qty: 60, unitVal: 0.25, unit: "kg" },
    { name: "Cabbage", price: 28, qty: 90, unitVal: 1, unit: "kg" },
    { name: "Cauliflower", price: 35, qty: 70, unitVal: 1, unit: "kg" },
    { name: "Brinjal", price: 45, qty: 85, unitVal: 1, unit: "kg" },
    { name: "Lady Finger", price: 55, qty: 75, unitVal: 0.5, unit: "kg" },
    { name: "Capsicum", price: 60, qty: 65, unitVal: 0.5, unit: "kg" },
  ],
  Fruits: [
    { name: "Mango", price: 120, qty: 50, unitVal: 1, unit: "kg" },
    { name: "Banana", price: 50, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Apple", price: 180, qty: 60, unitVal: 1, unit: "kg" },
    { name: "Orange", price: 80, qty: 90, unitVal: 1, unit: "kg" },
    { name: "Papaya", price: 40, qty: 70, unitVal: 1, unit: "kg" },
    { name: "Guava", price: 60, qty: 55, unitVal: 1, unit: "kg" },
    { name: "Pomegranate", price: 200, qty: 40, unitVal: 1, unit: "kg" },
    { name: "Watermelon", price: 25, qty: 80, unitVal: 1, unit: "kg" },
    { name: "Grapes", price: 140, qty: 45, unitVal: 0.5, unit: "kg" },
    { name: "Litchi", price: 160, qty: 35, unitVal: 0.5, unit: "kg" },
  ],
  Nuts: [
    { name: "Almonds", price: 800, qty: 30, unitVal: 0.5, unit: "kg" },
    { name: "Cashews", price: 900, qty: 25, unitVal: 0.5, unit: "kg" },
    { name: "Walnuts", price: 750, qty: 35, unitVal: 0.5, unit: "kg" },
    { name: "Pistachios", price: 1000, qty: 20, unitVal: 0.25, unit: "kg" },
    { name: "Raisins", price: 400, qty: 50, unitVal: 0.5, unit: "kg" },
    { name: "Peanuts", price: 200, qty: 80, unitVal: 1, unit: "kg" },
    { name: "Dates", price: 500, qty: 40, unitVal: 0.5, unit: "kg" },
    { name: "Fox Nuts (Makhana)", price: 600, qty: 30, unitVal: 0.25, unit: "kg" },
    { name: "Chia Seeds", price: 350, qty: 45, unitVal: 0.25, unit: "kg" },
    { name: "Flax Seeds", price: 180, qty: 55, unitVal: 0.5, unit: "kg" },
  ],
  Dairy: [
    { name: "Milk", price: 60, qty: 200, unitVal: 1, unit: "liter" },
    { name: "Curd", price: 50, qty: 150, unitVal: 500, unit: "ml" },
    { name: "Paneer", price: 300, qty: 40, unitVal: 0.5, unit: "kg" },
    { name: "Butter", price: 500, qty: 30, unitVal: 0.25, unit: "kg" },
    { name: "Ghee", price: 600, qty: 35, unitVal: 500, unit: "ml" },
    { name: "Cheese", price: 400, qty: 25, unitVal: 0.2, unit: "kg" },
    { name: "Buttermilk", price: 30, qty: 180, unitVal: 500, unit: "ml" },
    { name: "Cream", price: 150, qty: 50, unitVal: 250, unit: "ml" },
    { name: "Lassi", price: 40, qty: 120, unitVal: 300, unit: "ml" },
    { name: "Khoya", price: 450, qty: 20, unitVal: 0.25, unit: "kg" },
  ],
  Spices: [
    { name: "Turmeric", price: 120, qty: 60, unitVal: 0.25, unit: "kg" },
    { name: "Red Chili", price: 150, qty: 55, unitVal: 0.25, unit: "kg" },
    { name: "Cumin Seeds", price: 200, qty: 50, unitVal: 0.2, unit: "kg" },
    { name: "Coriander Powder", price: 100, qty: 70, unitVal: 0.25, unit: "kg" },
    { name: "Black Pepper", price: 500, qty: 30, unitVal: 0.1, unit: "kg" },
    { name: "Cardamom", price: 800, qty: 20, unitVal: 0.05, unit: "kg" },
    { name: "Cloves", price: 600, qty: 25, unitVal: 0.05, unit: "kg" },
    { name: "Cinnamon", price: 350, qty: 35, unitVal: 0.1, unit: "kg" },
    { name: "Mustard Seeds", price: 90, qty: 65, unitVal: 0.2, unit: "kg" },
    { name: "Fenugreek Seeds", price: 80, qty: 60, unitVal: 0.2, unit: "kg" },
  ],
  Pulses: [
    { name: "Toor Dal", price: 140, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Moong Dal", price: 130, qty: 90, unitVal: 1, unit: "kg" },
    { name: "Chana Dal", price: 100, qty: 110, unitVal: 1, unit: "kg" },
    { name: "Masoor Dal", price: 110, qty: 95, unitVal: 1, unit: "kg" },
    { name: "Urad Dal", price: 150, qty: 85, unitVal: 1, unit: "kg" },
    { name: "Rajma", price: 160, qty: 70, unitVal: 1, unit: "kg" },
    { name: "Chickpeas", price: 120, qty: 100, unitVal: 1, unit: "kg" },
    { name: "Green Gram", price: 125, qty: 80, unitVal: 1, unit: "kg" },
    { name: "Black Eyed Peas", price: 115, qty: 75, unitVal: 1, unit: "kg" },
    { name: "Horse Gram", price: 90, qty: 65, unitVal: 1, unit: "kg" },
  ],
};

// Pick `count` items from an array starting at `offset` (wraps around)
function pickItems(arr, count, offset) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(arr[(offset + i) % arr.length]);
  }
  return items;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const farmers = await User.find({ role: "farmer" }).sort({ email: 1 });
    if (farmers.length === 0) {
      console.log("No farmers found. Run seedFarmers.js first.");
      process.exit(1);
    }

    console.log(`Found ${farmers.length} farmers`);

    const categories = Object.keys(CATALOG);
    const catalogNames = categories.flatMap((category) => CATALOG[category].map((item) => item.name));
    const imageByName = await resolveProductImages(catalogNames);
    const productsWithoutPhotos = new Set();
    let totalInserted = 0;
    let totalSkipped = 0;

    for (let fi = 0; fi < farmers.length; fi++) {
      const farmer = farmers[fi];
      const itemsForFarmer = [];

      // 2 items from each of 5 categories + 2 from 6th = 12 items per farmer
      const itemsPerCategory = [2, 2, 2, 2, 2, 2]; // 12 items total

      let globalIdx = 0;
      for (let ci = 0; ci < categories.length; ci++) {
        const cat = categories[ci];
        const catalog = CATALOG[cat];
        const count = itemsPerCategory[ci];
        // Offset each farmer differently so they sell different items
        const offset = (fi * 3 + ci * 2) % catalog.length;
        const picked = pickItems(catalog, count, offset);

        for (const item of picked) {
          if (!imageByName[item.name]) {
            productsWithoutPhotos.add(item.name);
            continue;
          }
          itemsForFarmer.push({
            itemName: item.name,
            itemPrice: item.price + Math.floor(Math.random() * 10) - 5, // slight price variation
            itemImage: imageByName[item.name],
            itemCategory: cat,
            quantity: item.qty + Math.floor(Math.random() * 20) - 10,
            itemUnit: { value: item.unitVal, unit: item.unit },
            itemType: getProductType({ ...item, itemCategory: cat }),
            seller: {
              id: farmer._id,
              name: farmer.userName,
              email: farmer.email,
            },
          });
          globalIdx++;
        }
      }

      // Insert items for this farmer
      let farmerInserted = 0;
      let farmerSkipped = 0;
      for (const item of itemsForFarmer) {
        const existing = await Market.findOne({
          "seller.email": farmer.email,
          itemName: item.itemName,
        });
        if (existing) {
          farmerSkipped++;
          continue;
        }
        await Market.create(item);
        farmerInserted++;
      }

      console.log(
        `${farmer.userName}: ${farmerInserted} inserted, ${farmerSkipped} skipped`
      );
      totalInserted += farmerInserted;
      totalSkipped += farmerSkipped;
    }

    console.log(
      `\nDone: ${totalInserted} items inserted, ${totalSkipped} skipped`
    );
    if (productsWithoutPhotos.size) {
      console.warn(`No verified product photos; omitted: ${[...productsWithoutPhotos].join(", ")}`);
    }
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
