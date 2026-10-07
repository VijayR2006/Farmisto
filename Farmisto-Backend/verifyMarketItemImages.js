const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: require("path").join(__dirname, ".env") });

const Market = require("./models/Market");

async function verifyMarketItemImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const items = await Market.find({}).select("itemName itemImage").lean();
    const invalid = items.filter(
      (item) => !item.itemImage || /loremflickr|via\.placeholder|thumb\.wikimedia/i.test(item.itemImage)
    );

    if (invalid.length) {
      throw new Error(`${invalid.length} product records still have unreliable images.`);
    }

    const imageUrls = [...new Set(items.map((item) => item.itemImage))];
    for (const imageUrl of imageUrls) {
      let response;
      for (let attempt = 0; attempt < 3; attempt++) {
        response = await axios.get(imageUrl, {
          headers: { "User-Agent": "Farmisto/1.0 product-image-verification" },
          responseType: "stream",
          timeout: 15000,
          validateStatus: () => true,
        });
        response.data.destroy();
        if (response.status !== 429 || attempt === 2) break;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      if (response.status < 200 || response.status >= 400) {
        throw new Error(`Image URL returned HTTP ${response.status}: ${imageUrl}`);
      }
    }

    console.log(`Verified ${items.length} market items.`);
    console.log(`Distinct stored image URLs: ${imageUrls.length}`);
  } catch (error) {
    console.error("Market image verification failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

verifyMarketItemImages();