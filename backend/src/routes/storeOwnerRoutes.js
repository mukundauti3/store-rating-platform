const express = require("express");
const router = express.Router();
const storeOwnerController = require("../controllers/storeOwnerController");
const authMiddleware = require("../middleware/authMiddleware");
const { isStoreOwner } = require("../middleware/roleMiddleware");

// TEST ROUTE - no auth needed, pass ownerId as query param
// e.g. GET /api/store-owner/test?ownerId=11
router.get("/test", async (req, res) => {
  const { Store } = require("../models");
  const ownerId = parseInt(req.query.ownerId);
  console.log("TEST: looking for ownerId:", ownerId);
  const store = await Store.findOne({ where: { ownerId } });
  console.log("TEST: result:", store ? store.toJSON() : null);
  res.json({ ownerId, store });
});

router.get("/store", authMiddleware, isStoreOwner, storeOwnerController.getStore);
router.get("/ratings", authMiddleware, isStoreOwner, storeOwnerController.getRatings);
router.get("/dashboard", authMiddleware, isStoreOwner, storeOwnerController.getDashboard);

module.exports = router;
