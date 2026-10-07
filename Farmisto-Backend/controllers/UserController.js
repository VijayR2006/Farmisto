const User = require("../models/User");
const { GenerateToken, getJwtSecret } = require("../middleware/TokenAuth");
const Cart = require("../models/Cart");
const Market = require("../models/Market");
const { hashPassword, comparePassword } = require("../middleware/hashing");
const asyncHandler = require("../middleware/asyncHandler");
const { fetchLocation } = require("./GeoController");
const { google } = require("googleapis");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { getDisplayProductImage } = require("../utils/productImages");

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const findUserByEmail = (email) =>
  User.findOne({ email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } });

const UserRegister = asyncHandler(async (req, res) => {
  const { userName, email, password, role, userLocation } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const selectedRole = role || "consumer";

  if (typeof userName !== "string" || !userName.trim() || !normalizedEmail ||
      typeof password !== "string" || password.length < 8 || !isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter valid information. Passwords must be at least 8 characters." });
  }
  if (!["consumer", "farmer"].includes(selectedRole)) {
    return res.status(400).json({ message: "Please select a valid account type." });
  }
  getJwtSecret();

  const isUserAlreadyRegistered = await findUserByEmail(normalizedEmail).lean();
  if (isUserAlreadyRegistered) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const HashPassword = await hashPassword(password);

  const user = await User.create({
    userName: userName.trim(),
    email: normalizedEmail,
    password: HashPassword,
    role: selectedRole,
    userLocation: userLocation && userLocation.latitude ? userLocation : undefined,
  });

  // For farmers, fetch location asynchronously to get address details
  if (selectedRole === "farmer" && userLocation?.latitude && userLocation?.longitude) {
    fetchLocation(userLocation.latitude, userLocation.longitude)
      .then((GeoLocate) => {
        if (GeoLocate && GeoLocate.length > 0) {
          const addressArray = GeoLocate[0].formatted_address
            .split(",")
            .map((item) => item.trim());
          const len = addressArray.length;
          User.findByIdAndUpdate(user._id, {
            farmerCity: addressArray[len - 3],
            farmerStateZip: addressArray[len - 2],
            farmerAddress: GeoLocate[0].formatted_address,
            farmerCountry: addressArray[len - 1],
          }).catch((err) => console.error("Failed to update farmer location:", err));
        }
      })
      .catch((err) => console.error("Failed to fetch location:", err));
  }

  const token = GenerateToken(user);
  const { password: _, ...userWithoutPassword } = user.toObject();
  return res.status(201).json({
    message: "User registered successfully",
    user: userWithoutPassword,
    token,
    redirect: selectedRole === "farmer" ? "/farmer/dashboard" : "/",
  });
});

const UserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password || !isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email and password." });
  }
  getJwtSecret();

  const userInDB = await findUserByEmail(normalizedEmail).lean();
  if (!userInDB) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isPasswordMatched = await comparePassword(password, userInDB.password);
  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = GenerateToken(userInDB);
  const { password: _, ...userWithoutPassword } = userInDB;
  res.setHeader("Authorization", `Bearer ${token}`);
  return res.status(200).json({
    message: "Login successful",
    token,
    user: userWithoutPassword,
    redirect: userInDB.role === "farmer" ? "/farmer/dashboard" : "/",
  });
});

const GoogleLogin = asyncHandler(async (req, res) => {
  const { credential, role } = req.body;
  if (!credential) {
    return res.status(400).json({ message: "Google credential is required" });
  }
  if (role && !["consumer", "farmer"].includes(role)) {
    return res.status(400).json({ message: "Please select a valid account type." });
  }
  getJwtSecret();

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: "Google sign-in is not configured" });
  }

  const oauthClient = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID);
  const ticket = await oauthClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const googleUser = ticket.getPayload();

  if (!googleUser?.email || !googleUser.email_verified) {
    return res.status(401).json({ message: "Google account email could not be verified" });
  }

  let user = await findUserByEmail(normalizeEmail(googleUser.email));
  if (!user) {
    user = await User.create({
      userName: googleUser.name || googleUser.email.split("@")[0],
      email: normalizeEmail(googleUser.email),
      password: await hashPassword(crypto.randomBytes(32).toString("hex")),
      role: role === "farmer" ? "farmer" : "consumer",
    });
  }

  const token = GenerateToken(user);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  return res.status(200).json({
    message: "Google login successful",
    token,
    user: userWithoutPassword,
    redirect: user.role === "farmer" ? "/farmer/dashboard" : "/",
  });
});

const BuyItem = asyncHandler(async (req, res) => {
  const { id, quantity } = req.body;
  const parsedQuantity = Number(quantity);
  if (!mongoose.isValidObjectId(id) || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    return res.status(400).json({ message: "Please provide a valid product and quantity." });
  }

  const product = await Market.findById(id).lean();
  if (!product) return res.status(404).json({ message: "Product not found." });
  if (parsedQuantity > product.quantity) {
    return res.status(400).json({ message: "Requested quantity exceeds available stock." });
  }

  const ItemToCart = await Cart.create({
    id: product._id,
    itemName: product.itemName,
    itemPrice: product.itemPrice,
    imageUrl: getDisplayProductImage(product.itemName, product.itemImage),
    quantity: parsedQuantity,
    buyer: req.user.id,
    itemUnit: product.itemUnit,
    farmer: {
      id: product.seller.id,
      name: product.seller.name,
      email: product.seller.email,
    },
  });

  return res.status(201).json({
    message: "Item added to cart",
    item: ItemToCart,
    buyer: { _id: req.user.id, name: req.user.name },
  });
});

const GetUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "No user id provided!" });
  }
  if (id !== req.user.id) {
    return res.status(403).json({ message: "You do not have permission to view this profile." });
  }
  const user = await User.findById(id).lean();
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }
  const { password: _, ...userWithoutPassword } = user;
  return res.status(200).json({ user: userWithoutPassword });
});

const GetFarmer = asyncHandler(async (req, res) => {
  const { farmerId } = req.body || {};
  if (!mongoose.isValidObjectId(farmerId)) {
    return res.status(400).json({ message: "Please provide a valid farmer." });
  }

  const farmer = await User.findOne({ _id: farmerId, role: "farmer" })
    .select("userName farmerProfilePhoto farmerAddress farmerCity farmerStateZip farmerCountry");
  if (!farmer) {
    return res.status(404).json({ message: "Farmer not found." });
  }

  return res.status(200).json({
    farmer: {
      farmerName: farmer.userName,
      farmerProfilePhoto: farmer.farmerProfilePhoto,
      farmerAddress: farmer.farmerAddress,
      farmerCity: farmer.farmerCity,
      farmerStateZip: farmer.farmerStateZip,
      farmerCountry: farmer.farmerCountry,
    },
  });
});

const UserLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
  return res.status(200).json({ message: "Logged out successfully." });
});

const GetItemsByFarmerId = asyncHandler(async (req, res) => {
  const { farmerId } = req.body || {};
  if (!mongoose.isValidObjectId(farmerId)) {
    return res.status(400).json({ message: "Please provide a valid farmer." });
  }
  const items = await Market.find({ "seller.id": farmerId });
  if (!items.length) {
    return res.status(200).json({ message: "No items available!", items: [] });
  }
  const publicItems = items.map((item) => {
    const product = item.toObject ? item.toObject() : item;
    return {
      ...product,
      seller: { name: product.seller?.name },
    };
  });
  return res.status(200).json({ message: "Items fetched successfully!", items: publicItems });
});

module.exports = {
  UserRegister,
  UserLogin,
  GoogleLogin,
  UserLogout,
  BuyItem,
  GetUser,
  GetFarmer,
  GetItemsByFarmerId,
};
