const { Store, Rating, User } = require("../models");

// GET /api/store-owner/store
exports.getStore = async (req, res) => {
  try {
    const ownerId = parseInt(req.user.id);
    console.log("getStore called, ownerId:", ownerId, typeof ownerId);

    const store = await Store.findOne({
      where: { ownerId: ownerId },
    });

    console.log("store found:", store ? store.toJSON() : null);

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    res.status(200).json(store);
  } catch (err) {
    console.error("getStore error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/store-owner/ratings
exports.getRatings = async (req, res) => {
  try {
    const ownerId = parseInt(req.user.id);

    const store = await Store.findOne({
      where: { ownerId: ownerId },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/store-owner/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const ownerId = parseInt(req.user.id);
    console.log("getDashboard called, ownerId:", ownerId, typeof ownerId);

    const store = await Store.findOne({
      where: { ownerId: ownerId },
    });

    console.log("dashboard store found:", store ? store.toJSON() : null);

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
    });

    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
        : 0;

    res.status(200).json({
      storeName: store.name,
      totalRatings,
      averageRating: parseFloat(averageRating),
    });
  } catch (err) {
    console.error("getDashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};
