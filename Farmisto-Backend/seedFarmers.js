const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("./models/User");

dotenv.config({ path: path.join(__dirname, ".env") });

const DEMO_FARMERS = [
  { userName: "Farmisto Demo Farmer One", email: "demo-farmer-one@example.invalid", passwordEnv: "DEMO_FARMER_ONE_PASSWORD" },
  { userName: "Farmisto Demo Farmer Two", email: "demo-farmer-two@example.invalid", passwordEnv: "DEMO_FARMER_TWO_PASSWORD" },
  { userName: "Farmisto Demo Farmer Three", email: "demo-farmer-three@example.invalid", passwordEnv: "DEMO_FARMER_THREE_PASSWORD" },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be configured in the backend environment.");
  }
  if (!process.argv.includes("--confirm-demo-seed")) {
    throw new Error("This operation writes demo accounts. Re-run with --confirm-demo-seed to proceed.");
  }
  for (const farmer of DEMO_FARMERS) {
    const password = process.env[farmer.passwordEnv];
    if (!password || password.length < 12) {
      throw new Error(`${farmer.passwordEnv} must be set to a unique password of at least 12 characters.`);
    }
  }

  await mongoose.connect(process.env.MONGO_URI);
  let inserted = 0;

  for (const farmer of DEMO_FARMERS) {
    const passwordHash = await bcrypt.hash(process.env[farmer.passwordEnv], 12);
    const result = await User.updateOne(
      { email: farmer.email },
      {
        $setOnInsert: {
          userName: farmer.userName,
          email: farmer.email,
          password: passwordHash,
          role: "farmer",
        },
      },
      { upsert: true }
    );
    inserted += result.upsertedCount;
  }

  console.log(`Demo farmer seed complete: ${inserted} new accounts added.`);
}

seed()
  .catch((error) => {
    console.error("Demo farmer seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
