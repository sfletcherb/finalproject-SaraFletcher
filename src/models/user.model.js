const mongoose = require("mongoose");
const cartServiceInstance = require("../repositories/carts.repository.js");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    //required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  cryptoToken: {
    token: String,
    expiresAt: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (this.role === "user" && !this.cart) {
    try {
      const cart = await cartServiceInstance.createCart();
      this.cart = cart._id;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
