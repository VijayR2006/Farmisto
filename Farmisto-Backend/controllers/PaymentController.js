const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");
const pdf = require("pdfkit");
const asyncHandler = require("../middleware/asyncHandler");

const createPayment = asyncHandler(async (req, res) => {
  try {
    const { address } = req.body;
    if (!address || !address.street || !address.city || !address.state || !address.zip || !address.country) {
      return res.status(400).json({ message: "Shipping address is incomplete" });
    }

    const cartItems = await Cart.find({ buyer: req.user.id });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items cannot be empty" });
    }

    const farmersById = new Map();
    const updatedCartItems = cartItems.map((item) => {
      const itemPrice = Number(item.itemPrice);
      const quantity = Number(item.quantity);
      const discount = Number(item.discount || 0);

      if (!Number.isFinite(itemPrice) || itemPrice <= 0 || !Number.isFinite(quantity) || quantity <= 0) {
        throw new Error("Each cart item must have a valid price and quantity.");
      }

      const discountValue = (itemPrice * discount) / 100;
      const discountedPrice = Math.max(itemPrice - discountValue, 0);
      const totalItemCost = discountedPrice * quantity;
      farmersById.set(item.farmer.id.toString(), item.farmer);

      return {
        itemName: item.itemName,
        imageUrl: item.imageUrl,
        itemPrice,
        quantity,
        discount,
        itemUnit: item.itemUnit,
        discountedPrice: Number(discountedPrice.toFixed(2)),
        totalItemCost: Number(totalItemCost.toFixed(2)),
      };
    });

    const totalAmount = Number(
      updatedCartItems.reduce((sum, item) => sum + Number(item.totalItemCost), 0).toFixed(2)
    );

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Total payment amount must be greater than zero." });
    }

    const payment = new Payment({
      farmers: Array.from(farmersById.values()),
      buyer: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
      cartItems: updatedCartItems,
      totalAmount,
      address,
      paymentMethod: "COD",
    });

    await payment.save();

    const doc = new pdf();

    doc
      .fillColor("#006400")
      .fontSize(18)
      .text(`Invoice for Order #${payment._id}`, { align: "center" })
      .moveDown(1);

    doc
      .fontSize(14)
      .text(`Buyer Name: ${req.user.name}`, { align: "left" })
      .moveDown(0.5);
    doc.text(`Buyer Email: ${req.user.email}`, { align: "left" }).moveDown(0.5);
    doc.text(`Total Amount: Rs ${totalAmount.toFixed(2)}`).moveDown(2);

    const tableTop = doc.y;
    doc
      .fillColor("#008000")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Item Name", 40, tableTop, { width: 120, align: "left" })
      .text("Price", 180, tableTop, { width: 100, align: "right" })
      .text("Discount", 280, tableTop, { width: 80, align: "right" })
      .text("Quantity", 380, tableTop, { width: 80, align: "right" })
      .text("Discounted Price", 480, tableTop, { width: 100, align: "right" })
      .text("Total", 600, tableTop, { width: 100, align: "right" });

    doc
      .moveTo(30, tableTop + 15)
      .lineTo(600, tableTop + 15)
      .stroke();

    let currentY = tableTop + 20;
    updatedCartItems.forEach((item) => {
      doc
        .fillColor("#000000")
        .fontSize(10)
        .font("Helvetica")
        .text(item.itemName, 40, currentY, { width: 120, align: "left" })
        .text(`Rs ${item.itemPrice.toFixed(2)}`, 180, currentY, {
          width: 100,
          align: "right",
        })
        .text(`${item.discount}%`, 280, currentY, { width: 80, align: "right" })
        .text(item.quantity.toString(), 380, currentY, {
          width: 80,
          align: "right",
        })
        .text(`Rs ${item.discountedPrice}`, 480, currentY, {
          width: 100,
          align: "right",
        })
        .text(`Rs ${item.totalItemCost}`, 600, currentY, {
          width: 100,
          align: "right",
        });

      currentY += 20;
    });

    doc.moveTo(30, currentY).lineTo(600, currentY).stroke();

    doc
      .fillColor("#006400")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("\nFarmers Involved:", 40, currentY + 20);

    farmers.forEach((farmer, index) => {
      doc
        .fillColor("#000000")
        .fontSize(10)
        .font("Helvetica")
        .text(
          `${index + 1}. ${farmer.name} (${farmer.email})`,
          40,
          currentY + 50 + index * 20
        );
    });

    doc
      .fillColor("#006400")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("\nShipping Address:", 40, currentY + 60 + farmers.length * 20);
    doc
      .fillColor("#000000")
      .fontSize(10)
      .font("Helvetica")
      .text(
        `${address.street}, ${address.city}, ${address.state} - ${address.zip}, ${address.country}`,
        40,
        currentY + 100 + farmers.length * 20
      );

    doc
      .fillColor("#006400")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("\nPayment Method:", 40, currentY + 120 + farmers.length * 20);
    doc
      .fillColor("#000000")
      .fontSize(10)
      .font("Helvetica")
      .text(payment.paymentMethod, 40, currentY + 150 + farmers.length * 20);

    doc
      .fillColor("#8FBC8F")
      .fontSize(12)
      .font("Helvetica")
      .text("\nThank you for your purchase!", { align: "center" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${payment._id}.pdf"`
    );
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error("Error creating payment:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

const GetPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ "farmers.email": req.user.email });

  if (!payments || payments.length === 0) {
    return res.status(404).json({ message: "No payments found for this farmer" });
  }

  return res.status(200).json({ message: "Payments Fetched Successfully!", payments });
});

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_METHODS = ["COD"];

const UpdatePayment = asyncHandler(async (req, res) => {
  const { field, value, id } = req.body;
  const isValidUpdate = (field === "orderStatus" && ORDER_STATUSES.includes(value)) ||
    (field === "paymentMethod" && PAYMENT_METHODS.includes(value));
  if (!mongoose.isValidObjectId(id) || !isValidUpdate) {
    return res.status(400).json({ message: "The requested order update is invalid." });
  }
  const payment = await Payment.findOneAndUpdate(
    { _id: id, "farmers.id": req.user.id },
    { [field]: value },
    { new: true }
  );
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }
  return res.status(200).json({ message: "Payment updated", payment });
});


module.exports = { createPayment, GetPayments, UpdatePayment };
