const express = require("express");
const router = express.Router();
const productManagerInstance = require("../controllers/productManager.js");
const ProductModel = require("../models/products.model.js");

router.get("/", async (req, res) => {
  try {
    const data = await ProductModel.find();
    const limit = req.params.limit;

    if (limit && !isNaN(parseInt(limit))) {
      res.json(data.slice(0, limit));
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(404).send({ status: "404 Not Found", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let newProduct = req.body;
    await productManagerInstance.addProduct(newProduct);
    res
      .status(200)
      .send({ status: "success", message: "Product added successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const productById = await productManagerInstance.getProductById(productId);
    if (!productById) {
      res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(productById);
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const newChanges = req.body;

    const productById = await productManagerInstance.getProductById(productId);
    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }
    if ("id" in newChanges) {
      return res.status(400).json({ error: "ID cannot be updated" });
    }

    const codeExist = await ProductModel.exists({ code: newChanges.code });
    if (codeExist) {
      return res
        .status(400)
        .json({ error: "Code already exists in another product" });
    }

    await productManagerInstance.updateProduct(productId, newChanges);
    res
      .status(200)
      .send({ status: "success", message: "Product updated successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const productById = await productManagerInstance.getProductById(productId);
    if (!productById) {
      return res.status(404).json({ error: "Product not found" });
    }

    await productManagerInstance.deleteProduct(productId);
    res
      .status(200)
      .send({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

module.exports = router;
