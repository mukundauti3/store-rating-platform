const { Store, Rating } = require("../models");

// Get All Stores
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll();

    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Search Store
exports.searchStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    let where = {};

    if (name) {
      where.name = name;
    }

    if (address) {
      where.address = address;
    }

    const stores = await Store.findAll({
      where,
    });

    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Submit Rating
exports.addRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    const existingRating = await Rating.findOne({
      where: {
        userId: req.user.id,
        storeId,
      },
    });

    if (existingRating) {
      return res.status(400).json({
        message: "You have already rated this store",
      });
    }

    const newRating = await Rating.create({
      userId: req.user.id,
      storeId,
      rating,
    });

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Rating
exports.updateRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;

    const existingRating = await Rating.findOne({
      where: {
        userId: req.user.id,
        storeId,
      },
    });

    if (!existingRating) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    existingRating.rating = rating;

    await existingRating.save();

    res.status(200).json({
      message: "Rating updated successfully",
      rating: existingRating,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};