const productRepositoryInstance = require("../repositories/products.repository.js");

class ProductController {
  async getAllProducts(req, res) {
    const limit = req.query.limit;

    try {
      const data = await productRepositoryInstance.getAllProducts();
      if (limit && !isNaN(parseInt(limit))) {
        res.json(data.slice(0, limit));
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async getProductById(req, res) {
    const productId = req.params.pid;

    try {
      const productById = await productRepositoryInstance.getProductById(
        productId
      );

      if (!productById) {
        res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(productById);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async addProduct(req, res) {
    let newProduct = req.body;
    try {
      await productRepositoryInstance.addProduct(newProduct);
      res
        .status(200)
        .send({ status: "success", message: "Product added successfully" });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.pid;
    const newChanges = req.body;

    try {
      const productById = await productRepositoryInstance.getProductById(
        productId
      );
      if (!productById) {
        return res.status(404).json({ error: "Product not found" });
      }
      if ("id" in newChanges) {
        return res.status(400).json({ error: "ID cannot be updated" });
      }

      await productRepositoryInstance.updateProduct(productId, newChanges);
      res
        .status(200)
        .send({ status: "success", message: "Product updated successfully" });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;
    try {
      const productById = await productRepositoryInstance.getProductById(
        productId
      );
      if (!productById) {
        return res.status(404).json({ error: "Product not found" });
      }

      await productRepositoryInstance.deleteProduct(productId);
      res
        .status(200)
        .send({ status: "success", message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }
}

const productControllerInstance = new ProductController();

module.exports = productControllerInstance;
