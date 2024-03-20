const ProductModel = require("../models/products.model.js");

class ProductManager {
  async addProduct(dataProducts) {
    try {
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
      } = dataProducts;

      const codeExist = await ProductModel.findOne({ code: code });
      if (codeExist) {
        throw new Error("The code already exists");
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img: "sin imagen",
        code,
        stock,
        category,
        status,
        thumbnail: thumbnail || [],
      });

      await newProduct.save();
    } catch (error) {
      console.log("couldn't add product", error);
    }
  }

  async getProductById(id) {
    try {
      const findId = await ProductModel.findById(id);

      if (!findId) {
        console.log("Product not found");
        return null;
      } else {
        console.log("Product founded");
        return findId;
      }
    } catch (error) {
      console.log("Couldn't find product", error);
    }
  }

  async updateProduct(id, changes) {
    try {
      const existProduct = await ProductModel.findById(id);
      if (!existProduct) {
        throw new Error("Couldn't find product");
      }
      if ("id" in changes) {
        throw new Error("ID cannot be updated");
      }
      if (changes.code && changes.code !== existProduct.id) {
        const codeExist = await ProductModel.exists({ code: changes.code });
        if (codeExist) {
          throw new Error("Code already exists in another product");
        }
      }

      await ProductModel.findByIdAndUpdate(id, changes);
    } catch (error) {
      console.log("Couldn't update product", error);
    }
  }

  async deleteProduct(id) {
    try {
      const existProduct = await ProductModel.findById(id);
      if (!existProduct) {
        throw new Error("Couldn't find product");
      }

      await ProductModel.findByIdAndDelete(id);
      console.log("Product deleted");
    } catch (error) {
      console.log("Couldn't delete product", error);
      throw new Error("Couldn't delete product", error);
    }
  }
}

const productManagerInstance = new ProductManager();

module.exports = productManagerInstance;
