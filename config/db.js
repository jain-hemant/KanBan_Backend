const mongoose = require("mongoose");

const connectToDB = (DB_URL) => {
  try {
    mongoose.connect(DB_URL);
    console.log("Database connected successfully.");
  } catch (error) {
    console.log("Database connection failed.", error);
  }
};

module.exports = connectToDB;
