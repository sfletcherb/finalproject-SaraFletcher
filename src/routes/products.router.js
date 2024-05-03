const express = require("express");
const router = express.Router();
const productControllerInstance = require("../controllers/productManager.js");

router.get("/", productControllerInstance.getAllProducts);
router.get("/:pid", productControllerInstance.getProductById);
router.post("/", productControllerInstance.addProduct);
router.put("/:pid", productControllerInstance.updateProduct);
router.delete("/:pid", productControllerInstance.deleteProduct);

module.exports = router;
