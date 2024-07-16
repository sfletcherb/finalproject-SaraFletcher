const ProductModel = require("../models/products.model.js");
const CustomError = require("../helpers/errors/custom.error.js");
const EErrors = require("../helpers/errors/error.dictionary.js");
const { existsCode } = require("../helpers/errors/error.info.js");
const mongoose = require("mongoose");

class ProductRepository {
  async getAllProducts() {
    try {
      const data = await ProductModel.find();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      const objectId = mongoose.Types.ObjectId.createFromHexString(id);

      const findId = await ProductModel.findById(objectId);
      return findId;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProduct(dataProducts) {
    const {
      title,
      description,
      price,
      img,
      code,
      stock,
      category,
      status,
      thumbnail,
      owner,
    } = dataProducts;

    try {
      const codeExist = await ProductModel.findOne({ code: code });
      if (codeExist) {
        throw CustomError.createError({
          name: "ExistsCodeError",
          desc: existsCode(code),
          message: "The code already exists in the database",
          code: EErrors.CODE_ALREADY_EXISTS,
        });
      }
      const newProduct = new ProductModel({
        title,
        description,
        price,
        img: img || "sin imagen",
        code,
        stock,
        category,
        status,
        thumbnail: thumbnail || [],
        owner: owner || "admin",
      });

      return await newProduct.save();
    } catch (error) {
      if (error.code === 11000) {
        // Error de clave duplicada
        throw new Error(`Duplicate key error: ${error.message}`);
      }
      // Otros errores
      throw new Error(error.message);
    }
  }

  async updateProduct(id, changes) {
    try {
      const objectId = mongoose.Types.ObjectId.createFromHexString(id);

      await ProductModel.findByIdAndUpdate(objectId, changes);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const objectId = mongoose.Types.ObjectId.createFromHexString(id);

      await ProductModel.findByIdAndDelete(objectId);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const productRepositoryInstance = new ProductRepository();
module.exports = productRepositoryInstance;
