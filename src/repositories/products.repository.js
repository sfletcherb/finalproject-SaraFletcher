const ProductModel = require("../models/products.model.js");

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
      const findId = await ProductModel.findById(id);
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
    } = dataProducts;

    try {
      const codeExist = await ProductModel.findOne({ code: code });
      if (codeExist) {
        throw new Error("The code already exists");
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
      });

      return await newProduct.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, changes) {
    try {
      /* if (!changes?.code) {
        throw new Error("No se proporcionó un código de producto válido");
      }

      const isStockChange =
        Object.keys(changes).length === 1 && "stock" in changes;

      if (!isStockChange) {
        const codeExist = await ProductModel.exists({ code: changes.code });

        if (codeExist) {
          throw new Error("El código ya existe en otro producto");
        }
      } */

      await ProductModel.findByIdAndUpdate(id, changes);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    try {
      await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const productRepositoryInstance = new ProductRepository();
module.exports = productRepositoryInstance;
