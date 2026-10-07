const express = require("express");
const Authentication = require("../middleware/Authentication");
const requireRole = require("../middleware/Authorization");
const {
  PromoCodeGenerator,
  PromoCodeApply,
  PromoCodeDelete,
  PromoCodeList,
} = require("../controllers/PromoCodeController");
const router = express.Router();

router.post("/gen-promo", Authentication, requireRole("farmer"), PromoCodeGenerator);
router.post("/apply-promo", Authentication, PromoCodeApply);
router.delete("/del-promo/:id", Authentication, requireRole("farmer"), PromoCodeDelete);
router.get("/list-promos", Authentication, requireRole("farmer"), PromoCodeList);

module.exports = router;
