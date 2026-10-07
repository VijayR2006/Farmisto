const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  farmers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  ],
  buyer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  cartItems: [
    {
      itemName: { type: String, required: true },
      itemPrice: { type: Number, required: true },
      imageUrl: { type: String, required: true, trim: true },
      discount: { type: Number, min: 0, max: 100, default: 0 },
      quantity: { type: Number, required: true, min: 1 },
      discountedPrice: { type: Number, required: true },
      totalItemCost: { type: Number, required: true },
      itemUnit: {
        value: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
          enum: ["kg", "liter", "g", "ml"],
        },
      },
    },
  ],
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ["COD"],
    default: "COD",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
