const PromoCode = require("../models/PromoCode");
const asyncHandler = require("../middleware/asyncHandler");

const PromoCodeGenerator = asyncHandler(async (req, res) => {
  const { item, code, discountPercentage, expiryDate, usageLimit } = req.body;

  if (!code || !discountPercentage || !expiryDate || !usageLimit) {
    return res.status(400).json({ message: "Please provide all the required fields!" });
  }

  const promoCode = await PromoCode.create({
    item,
    code,
    discountPercentage,
    expiryDate: new Date(expiryDate),
    usageLimit,
    usedCount: 0,
  });

  return res.status(201).json({ message: "Promo Code created successfully", promo: promoCode });
});

const PromoCodeApply = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Please provide all the required fields!" });
  }

  const promoCode = await PromoCode.findOne({ code });

  if (!promoCode) {
    return res.status(404).json({ message: "Promo Code not found or expired!" });
  }

  if (new Date(promoCode.expiryDate) < new Date()) {
    return res.status(400).json({ message: "Promo code has expired" });
  }

  if (Number(promoCode.usageLimit) !== 0 && promoCode.usedCount >= promoCode.usageLimit) {
    return res.status(400).json({ message: "Promo code usage limit exceeded" });
  }

  promoCode.usedCount += 1;
  await promoCode.save();

  return res.status(200).json({
    message: "Promo Code applied successfully",
    promo: promoCode.discountPercentage,
  });
});

const PromoCodeDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Please provide all the required fields!" });
  }
  const promoCode = await PromoCode.findByIdAndDelete(id);
  if (!promoCode) {
    return res.status(404).json({ message: "Promo Code not found!" });
  }
  return res.status(200).json({ message: "Promo Code deleted successfully" });
});

const PromoCodeList = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.find();
  return res.status(200).json({ message: "Promo Codes fetched successfully!", promoCodes });
});

module.exports = {
  PromoCodeGenerator,
  PromoCodeApply,
  PromoCodeDelete,
  PromoCodeList,
};
