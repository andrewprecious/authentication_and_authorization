const express = require("express");
const router = express.Router();
const {
  getUserDashboard,
  update_profile,
  administratorDashboard,
} = require("../controllers/user_controller");
const {
  verifyToken,
  verifyTokenAndOwnerOrAdmin,
  verifyAndAdmin,
} = require("../controllers/verify_token");
const { verify } = require("jsonwebtoken");

// dashboard
router.get("/dashboard", verifyToken, getUserDashboard);

// editing user's information
router.get("/updateAccount/:id", verifyTokenAndOwnerOrAdmin, update_profile);

// Aministrator Dashboard
router.get("/adminDashboard", verifyAndAdmin, administratorDashboard);

module.exports = router;
