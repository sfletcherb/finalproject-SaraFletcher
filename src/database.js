const mongoose = require("mongoose");
const configObject = require("./config/dotenv.js");

const { mongo_url } = configObject;

mongoose
  .connect(mongo_url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Failed to connect to MongoDB", error));

module.exports = mongoose;
