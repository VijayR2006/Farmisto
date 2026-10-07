const User = require("../models/User");
const Feedback = require("../models/Feedback");
const asyncHandler = require("../middleware/asyncHandler");

const getPaymentSettings = asyncHandler(async (req, res) => {
  const farmer = await User.findOne({ email: req.user.email, role: "farmer" });
  if (!farmer) return res.status(404).json({ message: "Farmer not found" });
  return res.status(200).json({ payment: farmer.paymentSettings || {} });
});

const updatePaymentSettings = asyncHandler(async (req, res) => {
  const farmer = await User.findOne({ email: req.user.email, role: "farmer" });
  if (!farmer) return res.status(404).json({ message: "Farmer not found" });
  const allowedFields = ["accountHolderName", "accountNumber", "bankName", "ifscCode", "upiId", "paymentGateway"];
  Object.keys(req.body).forEach((key) => {
    if (allowedFields.includes(key)) {
      farmer.paymentSettings = farmer.paymentSettings || {};
      farmer.paymentSettings[key] = req.body[key];
    }
  });
  await farmer.save();
  return res.status(200).json({ message: "Payment settings updated", payment: farmer.paymentSettings });
});

const submitFeedback = asyncHandler(async (req, res) => {
  const { feedback } = req.body;
  if (typeof feedback !== "string" || !feedback.trim() || feedback.trim().length > 2000) {
    return res.status(400).json({ message: "Please enter feedback with 1 to 2000 characters." });
  }
  await Feedback.create({ user: req.user.id, message: feedback.trim() });
  return res.status(200).json({ message: "Feedback submitted successfully" });
});

module.exports = { getPaymentSettings, updatePaymentSettings, submitFeedback };
