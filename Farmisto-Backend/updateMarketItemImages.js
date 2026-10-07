const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").join(__dirname, ".env") });

const Market = require("./models/Market");
const {
  resolveProductImages,
  normalizeImageUrl,
  normalizeUploadImageUrl,
  LEGACY_CATEGORY_IMAGES,
} = require("./utils/productImages");

const PRODUCT_NAMES_TO_REFRESH = [
  "Onion", "Capsicum", "Cauliflower", "Spinach", "Brinjal", "Papaya", "Litchi", "Dates",
  "Almonds", "Chia Seeds", "Milk", "Paneer", "Red Chili", "Mustard Seeds",
  "Cinnamon", "Cardamom", "Black Pepper", "Cumin Seeds", "Masoor Dal",
  "Chana Dal", "Toor Dal", "Horse Gram", "Urad Dal", "Moong Dal",
];

async function updateMarketItemImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const items = await Market.find({
      $or: [
        { itemName: { $in: PRODUCT_NAMES_TO_REFRESH } },
        { "itemUnit.unit": "g" },
        { itemImage: { $in: [...LEGACY_CATEGORY_IMAGES] } },
        { itemImage: /^https:\/\/loremflickr\.com\// },
        { itemImage: /^https:\/\/thumb\.wikimedia\.org\// },
        { itemImage: /^https:\/\/upload\.wikimedia\.org\/.*\/960px-/ },
        { itemImage: { $exists: false } },
        { itemImage: "" },
      ],
    })
      .select("_id itemName itemImage itemUnit")
      .lean();

    if (!items.length) {
      console.log("No legacy or missing market item images found.");
      return;
    }

    const imageByName = await resolveProductImages(items.map((item) => item.itemName));
    const operations = items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: {
          $set: {
            itemImage: imageByName[item.itemName] || normalizeUploadImageUrl(item.itemImage),
            ...(item.itemUnit?.unit === "g"
              ? { "itemUnit.unit": "kg", "itemUnit.value": item.itemUnit.value / 1000 }
              : {}),
          },
        },
      },
    }));
    const result = await Market.bulkWrite(operations, { timestamps: false });

    console.log(`Updated ${result.modifiedCount} market item images.`);
  } catch (error) {
    console.error("Image migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

updateMarketItemImages();