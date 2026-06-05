const { User, Store, Rating } = require("../models");
const bcrypt = require("bcryptjs");

// Add User
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Add Store
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existingStore = await Store.findOne({
      where: { email },
    });

    if (existingStore) {
      return res.status(400).json({
        message: "Store already exists",
      });
    }

    const owner = await User.findByPk(ownerId);

    if (!owner) {
      return res.status(404).json({
        message: "Store Owner not found",
      });
    }

    if (owner.role !== "STORE_OWNER") {
      return res.status(400).json({
        message: "Selected user is not a Store Owner",
      });
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Stores
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

// Dashboard
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};