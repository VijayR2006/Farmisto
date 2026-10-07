const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["consumer", "farmer"],
      default: "consumer",
      index: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    userLocation: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    // Farmer-specific fields (only used when role === "farmer")
    farmerProfilePhoto: {
      type: String,
      default: "default_farmer_profile.jpg",
    },
    farmerMobile: {
      type: Number,
      unique: true,
      sparse: true,
    },
    farmerAddress: {
      type: String,
    },
    farmerCity: {
      type: String,
    },
    farmerStateZip: {
      type: String,
    },
    farmerCountry: {
      type: String,
    },
    // Payment settings (only used when role === "farmer")
    paymentSettings: {
      accountHolderName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      upiId: String,
      paymentGateway: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
