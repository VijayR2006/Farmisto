const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./models/User");
const Farmer = require("./models/Farmer");
const Cart = require("./models/Cart");
const Payment = require("./models/Payment");
const PromoCode = require("./models/PromoCode");
const Feedback = require("./models/Feedback");
const Market = require("./models/Market");

dotenv.config({ path: path.join(__dirname, ".env") });

const reset = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be configured in the backend environment.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const models = [
    ["users", User],
    ["legacy farmers", Farmer],
    ["carts", Cart],
    ["orders", Payment],
    ["promo codes", PromoCode],
    ["feedback", Feedback],
  ];
  const counts = await Promise.all(models.map(async ([name, Model]) => [name, await Model.countDocuments()]));
  const products = await Market.countDocuments();

  console.log("Data reset preview:");
  counts.forEach(([name, count]) => console.log(`  ${name}: ${count} records will be deleted`));
  console.log(`  market products: ${products} records will be preserved`);
  console.log("  market seller labels and contact emails will be anonymized");

  if (!process.argv.includes("--confirm-reset")) {
    console.log("Dry run only. Re-run with --confirm-reset to apply this reset.");
    return;
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Promise.all(models.map(([, Model]) => Model.deleteMany({}, { session })));
      await Market.updateMany(
        {},
        {
          $set: {
            "seller.name": "Farmisto Demo Farm",
            "seller.email": "marketplace@example.invalid",
          },
        },
        { session }
      );
    });
    console.log("User-specific data was reset; market products were preserved.");
  } finally {
    await session.endSession();
  }
};

reset()
  .catch((error) => {
    console.error("User-data reset failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
