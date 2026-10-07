const express = require("express");
const router = express.Router();
const Authentication = require('../middleware/Authentication');
const { GetCartDetail, ItemQuantityUpdate, ItemDelete, ItemDiscountUpdate, ClearCart } = require("../controllers/CartController");

router.post('/user',Authentication,GetCartDetail);
router.patch('/update/:id',Authentication,ItemQuantityUpdate);
router.delete('/delete/:id',Authentication,ItemDelete);
router.patch('/discount/:id',Authentication,ItemDiscountUpdate);
router.delete('/clear',Authentication,ClearCart);


module.exports = router;
