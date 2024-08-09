const express = require("express");
const router = express.Router();
const passport = require("passport");
const cartControllerInstance = require("../controllers/cartManager.js");
const ticketControllerInstance = require("../controllers/ticketManager.js");
const verifyRole = require("../middleware/authMiddleware.js");

router.post("/", cartControllerInstance.createCart);
router.get("/", cartControllerInstance.getAllCarts);
router.get("/:cid", cartControllerInstance.getCartById);
router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  verifyRole(["user", "premium"]),
  cartControllerInstance.addProductToCart
);
router.put("/:cid/products/:pid", cartControllerInstance.updateProductCart);
router.put("/:cid", cartControllerInstance.updateProductCartWithArray);
router.delete("/:cid/products/:pid", cartControllerInstance.deleteProductCart);
router.delete("/:cid", cartControllerInstance.deleteAllProductsCart);
router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  verifyRole(["user", "premium"]),
  ticketControllerInstance.createTicket
);
module.exports = router;
