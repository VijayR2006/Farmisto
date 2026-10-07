const User = require("../models/User");
const Farmer = require("../models/Farmer");
const Payment = require("../models/Payment");
const cloudinary = require("cloudinary").v2;
const connectCloudinary = require("../config/cloudinary");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");
connectCloudinary();

// Helper: Find farmer in User model first, then Farmer model (legacy)
const findFarmer = async (email) => {
  // Try new User model first
  let user = await User.findOne({ email, role: "farmer" });
  if (user) return { user, model: "User" };

  // Try legacy Farmer model
  const legacyFarmer = await Farmer.findOne({ farmerEmail: email });
  if (legacyFarmer) return { user: legacyFarmer, model: "Farmer" };

  return null;
};

// Helper: Normalize farmer data from either model
const normalizeFarmerData = (farmer, model) => {
  if (model === "User") {
    return {
      userName: farmer.userName,
      email: farmer.email,
      farmerProfilePhoto: farmer.farmerProfilePhoto,
      farmerMobile: farmer.farmerMobile,
      farmerAddress: farmer.farmerAddress,
      farmerCity: farmer.farmerCity,
      farmerStateZip: farmer.farmerStateZip,
      farmerCountry: farmer.farmerCountry,
      userLocation: farmer.userLocation,
    };
  }
  // Legacy Farmer model
  return {
    userName: farmer.farmerName,
    email: farmer.farmerEmail,
    farmerProfilePhoto: farmer.farmerProfilePhoto,
    farmerMobile: farmer.farmerMobile,
    farmerAddress: farmer.farmerAddress,
    farmerCity: farmer.farmerCity,
    farmerStateZip: farmer.farmerStateZip,
    farmerCountry: farmer.farmerCountry,
    userLocation: farmer.farmerLocation,
  };
};

const getProfile = asyncHandler(async (req, res) => {
  const result = await findFarmer(req.user.email);
  if (!result) {
    return res.status(404).json({ message: "Farmer not found" });
  }

  const { password: _, ...farmerData } = result.user.toObject ? result.user.toObject() : result.user;
  const normalized = normalizeFarmerData(farmerData, result.model);

  return res.status(200).json({ farmer: normalized });
});

const updateProfile = asyncHandler(async (req, res) => {
  const fields = req.body;

  if (!fields && !req.file) {
    return res.status(400).json({ message: "No fields or file provided!" });
  }

  const result = await findFarmer(req.user.email);
  if (!result) {
    return res.status(404).json({ message: "Farmer profile not found!" });
  }

  const { user: profile, model } = result;

  // Field mapping: frontend name -> backend field name per model
  const fieldMap = {
    User: {
      userName: "userName",
      farmerMobile: "farmerMobile",
      farmerAddress: "farmerAddress",
      farmerCity: "farmerCity",
      farmerStateZip: "farmerStateZip",
      farmerCountry: "farmerCountry",
    },
    Farmer: {
      userName: "farmerName",
      farmerMobile: "farmerMobile",
      farmerAddress: "farmerAddress",
      farmerCity: "farmerCity",
      farmerStateZip: "farmerStateZip",
      farmerCountry: "farmerCountry",
    },
  };

  const mapping = fieldMap[model];
  Object.keys(fields).forEach((key) => {
    const dbField = mapping[key];
    if (dbField) {
      profile[dbField] = fields[key];
    }
  });

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Farmer_Profiles",
    });
    profile.farmerProfilePhoto = result.secure_url;
  }

  await profile.save();

  return res.status(200).json({
    message: "Profile updated successfully",
  });
});

const editPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both currentPassword and newPassword are required" });
  }

  const farmerId = req.user?.id;
  if (!farmerId) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }

  // Try User model first
  let profile = await User.findById(farmerId);
  let isUserModel = true;

  // If not found or not a farmer, try Farmer model
  if (!profile) {
    profile = await Farmer.findById(farmerId);
    isUserModel = false;
  }

  if (!profile) {
    return res.status(404).json({ message: "Farmer not found" });
  }

  const passwordField = isUserModel ? profile.password : profile.farmerPassword;
  const isCorrectPassword = await bcrypt.compare(currentPassword, passwordField);
  if (!isCorrectPassword) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  if (isUserModel) {
    profile.password = hashedPassword;
  } else {
    profile.farmerPassword = hashedPassword;
  }
  await profile.save();

  return res.status(200).json({
    message: "Password updated successfully",
  });
});

const GetSalesData = async (req, res) => {
  try {
    const payments = await Payment.find({
      orderStatus: "Delivered",
    });

    const salesData = {
      Weekly: [0, 0, 0, 0],
      Monthly: [0, 0, 0, 0],
      Yearly: [0, 0, 0, 0],
    };

    const currentDate = new Date();

    payments.forEach((payment) => {
      const orderDate = new Date(payment.createdAt);

      const weekDifference = Math.floor(
        (currentDate - orderDate) / (7 * 24 * 60 * 60 * 1000)
      );
      const monthDifference =
        currentDate.getMonth() -
        orderDate.getMonth() +
        12 * (currentDate.getFullYear() - orderDate.getFullYear());
      const yearDifference =
        currentDate.getFullYear() - orderDate.getFullYear();

      if (weekDifference < 4) {
        salesData.Weekly[3 - weekDifference] += payment.totalAmount;
      }

      if (monthDifference < 4) {
        salesData.Monthly[3 - monthDifference] += payment.totalAmount;
      }

      if (yearDifference < 4) {
        salesData.Yearly[3 - yearDifference] += payment.totalAmount;
      }
    });

    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const GetDashboard = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ "farmers.email": req.user.email });
  const filtered = payments.filter((item) => item.cartItems != undefined);
  const allFilteredCartItems = filtered
    .flatMap((payment) => payment.cartItems)
    .filter((item) => item.itemUnit != undefined);

  const totalProduce = allFilteredCartItems.reduce((acc, cartItem) => {
    if (cartItem.itemUnit.unit) {
      if (!acc.unit) acc.unit = cartItem.itemUnit.unit;
      acc.amount = (acc.amount || 0) + cartItem.quantity;
    }
    return acc;
  }, {});

  const revenue = payments.reduce((acc, order) => {
    return order.orderStatus === "Delivered" ? acc + order.totalAmount : acc;
  }, 0);

  const transactions = payments.filter((order) => order.orderStatus === "Delivered");

  const userReached = payments.reduce((acc, order) => {
    if (!acc[order.buyer.email]) acc[order.buyer.email] = true;
    return acc;
  }, {});

  const coordinates = await Promise.all(
    transactions.map(async (payment) => {
      const user = await User.findOne({ email: payment.buyer.email });
      if (user && user.userLocation) {
        return { email: payment.buyer.name, location: user.userLocation };
      }
      return null;
    })
  );

  const validCoordinates = coordinates.filter(
    (loc) => loc !== null && loc.location.latitude !== undefined && loc.location.longitude !== undefined
  );
  const uniqueCoordinates = [
    ...new Set(validCoordinates.map((u) => JSON.stringify(u.location))),
  ].map((loc) => JSON.parse(loc));

  const validUniqueCoordinates = uniqueCoordinates.filter(
    (loc) => loc.latitude !== null && loc.longitude !== null
  );

  const periods = { weeks: 6, months: 12, years: 5 };
  const salesData = {
    Weekly: Array(periods.weeks).fill(0),
    Monthly: Array(periods.months).fill(0),
    Yearly: Array(periods.years).fill(0),
  };
  const currentDate = new Date();

  transactions.forEach((payment) => {
    const orderDate = new Date(payment.createdAt);
    const weekDiff = Math.floor((currentDate - orderDate) / (7 * 24 * 60 * 60 * 1000));
    const monthDiff = currentDate.getMonth() - orderDate.getMonth() + 12 * (currentDate.getFullYear() - orderDate.getFullYear());
    const yearDiff = currentDate.getFullYear() - orderDate.getFullYear();
    if (weekDiff < periods.weeks) salesData.Weekly[periods.weeks - 1 - weekDiff] += payment.totalAmount;
    if (monthDiff < periods.months) salesData.Monthly[periods.months - 1 - monthDiff] += payment.totalAmount;
    if (yearDiff < periods.years) salesData.Yearly[periods.years - 1 - yearDiff] += payment.totalAmount;
  });

  const dashData = {
    produceCount: totalProduce,
    revenue,
    totalTransactions: transactions.length,
    userReach: Object.keys(userReached).length,
    salesData,
    transactions,
    coordinates: validUniqueCoordinates,
  };

  return res.status(200).json({
    message: "Dashboard Fetched Successfully",
    dashboard: dashData,
  });
});

const GetFarmerLocation = asyncHandler(async (req, res) => {
  const result = await findFarmer(req.user.email);
  if (!result) {
    return res.status(404).json({ message: "Farmer not found" });
  }

  const location = result.model === "User"
    ? result.user.userLocation
    : result.user.farmerLocation;

  return res.status(200).json({
    farmerLocation: {
      latitude: location?.latitude,
      longitude: location?.longitude,
    },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  editPassword,
  GetDashboard,
  GetFarmerLocation,
};
