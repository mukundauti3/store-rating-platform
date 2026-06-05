const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// User -> Rating
User.hasMany(Rating, {
  foreignKey: "userId",
});

Rating.belongsTo(User, {
  foreignKey: "userId",
});

// Store -> Rating
Store.hasMany(Rating, {
  foreignKey: "storeId",
});

Rating.belongsTo(Store, {
  foreignKey: "storeId",
});

// Store Owner -> Store
User.hasMany(Store, {
  foreignKey: "ownerId",
});

Store.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

module.exports = {
  User,
  Store,
  Rating,
};