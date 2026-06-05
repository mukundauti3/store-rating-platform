const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  isAdmin,
} = require("../middleware/roleMiddleware");

router.post(
  "/users",
  authMiddleware,
  isAdmin,
  adminController.addUser
);

router.get(
  "/users",
  authMiddleware,
  isAdmin,
  adminController.getUsers
);

router.post(
  "/stores",
  authMiddleware,
  isAdmin,
  adminController.addStore
);

router.get(
  "/stores",
  authMiddleware,
  isAdmin,
  adminController.getStores
);

router.get(
  "/dashboard",
  authMiddleware,
  isAdmin,
  adminController.dashboard
);

module.exports = router;