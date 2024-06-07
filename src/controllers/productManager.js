const productRepositoryInstance = require("../repositories/products.repository.js");
const CustomError = require("../helpers/errors/custom.error.js");
const EErrors = require("../helpers/errors/error.dictionary.js");
const {
  errorDB,
  getErrorNotFound,
  existsCode,
} = require("../helpers/errors/error.info.js");

class ProductController {
  async getAllProducts(req, res, next) {
    const limit = req.query.limit;

    try {
      const data = await productRepositoryInstance.getAllProducts();

      if (!data) {
        throw CustomError.createError({
          name: "DatabaseConnectionError",
          desc: errorDB(data),
          message: "Failed to connect to the database",
          code: EErrors.DB_ERROR,
        });
      }

      if (limit && !isNaN(parseInt(limit))) {
        res.json(data.slice(0, limit));
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    const productId = req.params.pid;

    try {
      const productById = await productRepositoryInstance.getProductById(
        productId
      );

      if (!productById) {
        throw CustomError.createError({
          name: "ProductNotFoundError",
          desc: getErrorNotFound(productById),
          message: "The requested data could not be found in the database",
          code: EErrors.NOT_FOUND,
        });
      }
      res.status(200).json(productById);
    } catch (error) {
      next(error);
    }
  }

  async addProduct(req, res, next) {
    let newProduct = req.body;

    try {
      await productRepositoryInstance.addProduct(newProduct);
      res
        .status(200)
        .send({ status: "success", message: "Product added successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    const productId = req.params.pid;
    const newChanges = req.body;

    try {
      const productById = await productRepositoryInstance.getProductById(
        productId
      );
      if (!productById) {
        throw CustomError.createError({
          name: "ProductNotFoundError",
          desc: getErrorNotFound(productById),
          message: "The requested data could not be found in the database",
          code: EErrors.NOT_FOUND,
        });
      }
      if ("id" in newChanges) {
        return res.status(400).json({ error: "ID cannot be updated" });
      }

      await productRepositoryInstance.updateProduct(productId, newChanges);
      res
        .status(200)
        .send({ status: "success", message: "Product updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    const productId = req.params.pid;

    try {
      const productById = await productRepositoryInstance.getProductById(
        productId
      );
      if (!productById) {
        throw CustomError.createError({
          name: "ProductNotFoundError",
          desc: getErrorNotFound(productById),
          message: "The requested data could not be found in the database",
          code: EErrors.NOT_FOUND,
        });
      }

      await productRepositoryInstance.deleteProduct(productId);
      res
        .status(200)
        .send({ status: "success", message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

const productControllerInstance = new ProductController();

module.exports = productControllerInstance;
