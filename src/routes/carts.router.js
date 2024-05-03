const express = require("express");
const router = express.Router();
const cartControllerInstance = require("../controllers/cartManager.js");

router.post("/", cartControllerInstance.createCart);
router.get("/", cartControllerInstance.getAllCarts);
router.get("/:cid", cartControllerInstance.getCartById);
router.post("/:cid/product/:pid", cartControllerInstance.addProductToCart);
router.put("/:cid/products/:pid", cartControllerInstance.updateProductCart);
router.put("/:cid", cartControllerInstance.updateProductCartWithArray);
router.delete("/:cid/products/:pid", cartControllerInstance.deleteProductCart);
router.delete("/:cid", cartControllerInstance.deleteAllProductsCart);
module.exports = router;
