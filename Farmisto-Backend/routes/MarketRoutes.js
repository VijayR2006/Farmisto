const express = require("express");
const { AddItem, DeleteItem, GetItems, GetMarketStats, GetItemsByFarmerEmail } = require("../controllers/MarketController");
const Authentication = require("../middleware/Authentication");
const requireRole = require("../middleware/Authorization");
const upload = require('../config/multer')
const router = express.Router();



router.post("/add-item", Authentication, requireRole("farmer"), upload.single("itemImage"), AddItem);
router.delete("/delete-item", Authentication, requireRole("farmer"), DeleteItem);
router.get("/stats", GetMarketStats);
router.get("/get-items", GetItems);
router.get("/get-items-farmer",Authentication,requireRole("farmer"),GetItemsByFarmerEmail);

module.exports = router;
