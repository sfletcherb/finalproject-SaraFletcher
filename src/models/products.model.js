const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Create Schema object for collection
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  img: {
    type: String,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  thumbnail: {
    type: [String],
  },
  owner: {
    type: String,
    required: true,
    default: "admin",
  },
});

//Adding plugin for watching the results in pages
productSchema.plugin(mongoosePaginate);

// Create model of product
const ProductModel = mongoose.model("products", productSchema);
module.exports = ProductModel;
