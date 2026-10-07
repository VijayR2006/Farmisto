const express = require("express");
const Market = require("../models/Market");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const fs = require("fs/promises");
const path = require("path");
const FormData = require("form-data");
const streamifier = require("streamifier");
const asyncHandler = require("../middleware/asyncHandler");
const { getDisplayProductImage } = require("../utils/productImages");
const { getProductType } = require("../utils/productTypes");

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

const AddItem = asyncHandler(async (req, res) => {
  const { itemName, itemPrice, itemCategory,itemType,quantity,unit,itemValue } = req.body;

  if (!itemName || !itemPrice || !itemCategory || !itemType || !quantity || !unit || ! itemValue) {
    return res.status(400).json({ message: "Missing item details!" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No image file provided!" });
  }

  try {
    const imagePath = path.join(__dirname, '..', req.file.path);
    const imageBuffer = await fs.readFile(imagePath);
    let uploadedImageUrl = null;

    if (REMOVE_BG_API_KEY) {
      const form = new FormData();
      form.append('image_file', imageBuffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
      form.append('size', 'auto');

      const removeBgResponse = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        form, {
          headers: {
            'X-Api-Key': REMOVE_BG_API_KEY,
            ...form.getHeaders(),
          },
          responseType: 'arraybuffer',
        }
      );

      const supportedImages = ["image/jpeg", "image/png", "image/jpg"];
      const contentType = removeBgResponse.headers['content-type'];

      if (!supportedImages.includes(contentType)) {
        return res.status(400).json({ message: "Invalid image type" });
      }

      const imageStream = streamifier.createReadStream(removeBgResponse.data);
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "Farmisto" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        );
        imageStream.pipe(uploadStream);
      });
      uploadedImageUrl = uploadResult?.secure_url;
    } else {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imagePath, { folder: "Farmisto" }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      });
      uploadedImageUrl = uploadResult?.secure_url;
    }

    const marketItem = await Market.create({
      itemName,
      itemPrice,
      itemImage: uploadedImageUrl,
      quantity,
      itemCategory,
      itemType,
      itemUnit:{
        value: itemValue,
        unit: unit
      },
      seller: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
    });
    return res.status(200).json({ message: "Successfully added the item!", item: marketItem });

  } catch (error) {
    return res.status(500).json({ message: "Error while adding the item!", error: error.message });
  }
});

const DeleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res.status(400).json({ message: "No item id provided!" });
  }

  try {
    const item = await Market.findOne({ _id: itemId, "seller.id": req.user.id });
    if (!item) {
      return res.status(404).json({ message: "Item not found or you do not own this item." });
    }

    await Market.findByIdAndDelete(itemId);
    return res.status(200).json({ message: "Successfully deleted the item!" });
  } catch (error) {
    return res.status(500).json({ message: "Error while deleting the item!", error: error.message });
  }
});

const GetItems = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Market.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Market.countDocuments({}),
  ]);

  if (!items.length) {
    return res.status(200).json({ message: "No items available!", items: [], total: 0, page, pages: 0 });
  }

  res.set("Cache-Control", "public, max-age=30");
  return res.status(200).json({
    message: "Items fetched successfully!",
    items: items.map((item) => ({
      ...item,
      itemType: getProductType(item),
      itemImage: getDisplayProductImage(item.itemName, item.itemImage),
      seller: { name: item.seller?.name },
    })),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

const GetMarketStats = asyncHandler(async (req, res) => {
  const [productCount, farmerIds] = await Promise.all([
    Market.countDocuments({}),
    Market.distinct("seller.id"),
  ]);
  const farmerCount = farmerIds.length
    ? await User.countDocuments({ _id: { $in: farmerIds }, role: "farmer" })
    : 0;

  res.set("Cache-Control", "public, max-age=30");
  return res.status(200).json({
    farmerCount,
    productCount,
    averageRating: null,
  });
});

const GetItemsByFarmerEmail = asyncHandler(async (req, res) => {
  const items = await Market.find({ "seller.id": req.user.id });
  if (!items.length) {
    return res.status(200).json({ message: "No items available!", items: [] });
  }
  return res.status(200).json({ message: "Items fetched successfully!", items });
});

module.exports = {
  AddItem,
  DeleteItem,
  GetItems,
  GetMarketStats,
  GetItemsByFarmerEmail
};
