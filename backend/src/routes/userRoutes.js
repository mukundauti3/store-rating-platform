const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/stores",
  authMiddleware,
  userController.getStores
);

router.get(
  "/stores/search",
  authMiddleware,
  userController.searchStores
);

router.post(
  "/rate",
  authMiddleware,
  userController.addRating
);

router.put(
  "/rate/:storeId",
  authMiddleware,
  userController.updateRating
);

module.exports = router;