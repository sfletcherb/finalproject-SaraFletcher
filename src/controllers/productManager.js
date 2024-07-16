const productRepositoryInstance = require("../repositories/products.repository.js");
const CustomError = require("../helpers/errors/custom.error.js");
const EErrors = require("../helpers/errors/error.dictionary.js");
const {
  errorDB,
  getErrorNotFound,
  existsCode,
} = require("../helpers/errors/error.info.js");
const { request } = require("express");

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
      req.logger.debug(`Current Product ID: ${productById}`);
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
      req.logger.debug(`Current Product ID: ${productById}`);
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
    const userRole = req.user.role;
    console.log("userRole", userRole);

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

      if (userRole === "premium" && productById.owner !== "premium") {
        req.logger.error(
          "You are not allowed to delete this product created by admin user"
        );
        return res.status(403).send({
          status: "error",
          message: "You are not allowed to delete this product",
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
