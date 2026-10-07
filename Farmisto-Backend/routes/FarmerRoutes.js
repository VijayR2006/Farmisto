const express = require('express');
const { getProfile, updateProfile, editPassword, GetDashboard, GetFarmerLocation } = require('../controllers/FarmerController');
const { getPaymentSettings, updatePaymentSettings, submitFeedback } = require('../controllers/FarmerSettingsController.js');
const Authentication = require('../middleware/Authentication');
const requireRole = require('../middleware/Authorization');
const router = express.Router();
const upload = require('../config/multer')

// Note: Register and Login are now handled by /user/register and /user/login

router.get("/settings/profile-data", Authentication, requireRole("farmer"), getProfile)
router.patch("/settings/update-profile", Authentication, requireRole("farmer"), upload.single("profilePhoto"), updateProfile)
router.patch("/settings/changePassword", Authentication, requireRole("farmer"), editPassword)
router.get("/dashboard", Authentication, requireRole("farmer"), GetDashboard)
router.get('/location', Authentication, requireRole("farmer"), GetFarmerLocation)

router.get("/settings/payment-data", Authentication, requireRole("farmer"), getPaymentSettings);
router.patch("/settings/update-payment", Authentication, requireRole("farmer"), updatePaymentSettings);
router.post("/support/feedback", Authentication, requireRole("farmer"), submitFeedback);

module.exports = router;
