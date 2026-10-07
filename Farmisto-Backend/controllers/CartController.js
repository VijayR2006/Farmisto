const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * Calculates derived fields for a cart item based on price, discount, and quantity.
 * @param {Object} item - The cart item document.
 * @returns {{discountedPrice:number, saving:number, totalCost:number}}
 */
const calculateItemFields = (item) => {
  const price = parseFloat(item.itemPrice) || 0;
  const discount = parseFloat(item.discount) || 0;
  const quantity = parseInt(item.quantity) || 0;

  const discountedPrice = price * (1 - discount / 100);
  const saving = price - discountedPrice;
  const totalCost = discountedPrice * quantity;

  return {
    discountedPrice,
    saving,
    totalCost,
  };
};

/**
 * Retrieves cart details for a given buyer ID.
 */
const GetCartDetail = asyncHandler(async (req, res) => {
  const buyerId = req.user?.id || req.body?.id;

  if (!buyerId) {
    return res.status(400).json({ message: "User id is required" });
  }

  const cartItems = await Cart.find({ buyer: buyerId });

  if (!cartItems.length) {
    return res.status(200).json({
      message: "Cart is empty",
      data: [],
      success: true,
    });
  }

  let grandTotal = 0;
  let totalSavings = 0;

  const allItemsOfCart = cartItems.map((item) => {
    const discountedPrice = item.discountedPrice;
    const savings = item.savingPrice;
    const totalCost = item.totalItemCost;

    grandTotal += totalCost;
    totalSavings += savings;

    return {
      id: item.id,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      imageUrl: item.imageUrl,
      discount: item.discount,
      saving: savings,
      quantity: item.quantity,
      totalCost: totalCost,
      discountedPrice: discountedPrice,
      itemUnit: item.itemUnit,
      farmer: {
        name: item.farmer.name,
      },
    };
  });

  return res.status(200).json({
    message: "All Cart data is here",
    cart: allItemsOfCart,
    grandTotal,
    totalSavings,
    buyer: {
      id: req.user.id,
      name: req.user.name,
    },
    success: true,
  });
});

/**
 * Clears the entire cart for a user.
 */
const ClearCart = asyncHandler(async (req, res) => {
  const buyerId = req.user?.id || req.body?.id;

  if (!buyerId) {
    return res.status(400).json({
      message: "No user id provided!",
    });
  }

  const cart = await Cart.deleteMany({ buyer: buyerId });

  if (cart.deletedCount === 0) {
    return res.status(404).json({
      message: "No cart found for this user!",
    });
  }

  return res.status(200).json({
    message: "Cart deleted successfully!",
    cart,
  });
});

/**
 * Updates the quantity of a cart item.
 */
const ItemQuantityUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { updatedQuantity } = req.body;
  const buyerId = req.user?.id;

  if (!id) {
    return res.status(400).json({
      message: "No item id provided!",
    });
  }

  if (!buyerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (
    updatedQuantity == null ||
    isNaN(updatedQuantity) ||
    updatedQuantity < 1
  ) {
    return res.status(400).json({
      message: "Invalid quantity!",
    });
  }

  const item = await Cart.findOne({ _id: id, buyer: buyerId });
  if (!item) {
    return res.status(404).json({ message: "Item not found or not owned by this user" });
  }

  Object.assign(item, { quantity: updatedQuantity });
  await item.save();

  if (!item) {
    return res.status(404).json({
      message: "Item not found!",
    });
  }

  return res.status(200).json({
    message: "Item quantity updated successfully!",
    item,
  });
});

/**
 * Deletes a single item from the cart.
 */
const ItemDelete = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const buyerId = req.user?.id;

  if (!id) {
    return res.status(400).json({
      message: "No item id provided!",
    });
  }

  if (!buyerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const item = await Cart.findOneAndDelete({ _id: id, buyer: buyerId });

  if (!item) {
    return res.status(404).json({
      message: "Item not found or not owned by this user",
    });
  }

  return res.status(200).json({
    message: "Item deleted successfully!",
    item,
  });
});

/**
 * Updates the discount of a cart item.
 */
const ItemDiscountUpdate = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { discount } = req.body;
  const buyerId = req.user?.id;

  if (!id) {
    return res.status(400).json({
      message: "No item id provided!",
    });
  }

  if (!buyerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (
    discount == null ||
    isNaN(discount) ||
    discount < 0 ||
    discount > 100
  ) {
    return res.status(400).json({
      message: "Invalid discount percentage!",
    });
  }

  const item = await Cart.findOne({ _id: id, buyer: buyerId });

  if (!item) {
    return res.status(404).json({
      message: "Item not found or not owned by this user",
    });
  }

  item.discount = discount;

  const {
    discountedPrice,
    saving,
    totalCost,
  } = calculateItemFields(item);

  item.discountedPrice = discountedPrice;
  item.savingPrice = saving;
  item.totalItemCost = totalCost;

  await item.save();

  return res.status(200).json({
    message: "Item discount updated successfully!",
    item,
  });
});

/**
 * Export all cart controller functions.
 */
module.exports = {
  GetCartDetail,
  ClearCart,
  ItemQuantityUpdate,
  ItemDelete,
  ItemDiscountUpdate,
};