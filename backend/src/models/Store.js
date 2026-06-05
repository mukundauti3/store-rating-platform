const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Store = sequelize.define("Store", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  ownerId: {
  type: DataTypes.INTEGER,
  allowNull: true
},

  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
  },
});

module.exports = Store;