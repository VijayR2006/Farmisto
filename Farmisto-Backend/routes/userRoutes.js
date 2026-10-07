const express = require('express');
const { UserRegister, UserLogin, GoogleLogin, UserLogout, BuyItem, GetUser, GetFarmer, GetItemsByFarmerId } = require('../controllers/UserController');
const Authentication = require('../middleware/Authentication');
const { fetchNearbyFarmers } = require('../controllers/GeoController');

const router = express.Router();

router.post('/register', UserRegister);
router.post('/login', UserLogin);
router.post('/google', GoogleLogin);
router.post('/logout', Authentication, UserLogout);
router.post('/buy-item', Authentication, BuyItem);
router.get('/get-user/:id', Authentication, GetUser);
router.post('/get-farmer', GetFarmer);
router.get('/fetch-nearby-farmers', Authentication, fetchNearbyFarmers);
router.post('/get-items-by-farmerId', Authentication, GetItemsByFarmerId);

module.exports = router;
