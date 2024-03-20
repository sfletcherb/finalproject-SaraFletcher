const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://saflebri:coderhouse@cluster0.1fc01sx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Failed to connect to MongoDB", error));

module.exports = mongoose;
