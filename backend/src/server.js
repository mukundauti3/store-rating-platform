require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

// Load all models & associations
require("./models");

const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Error:", err);
  });