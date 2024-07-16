const express = require("express");
const passport = require("passport");
const router = express.Router();
const productControllerInstance = require("../controllers/productManager.js");
const verifyRole = require("../middleware/authMiddleware.js");

router.get("/", productControllerInstance.getAllProducts);
router.get("/:pid", productControllerInstance.getProductById);
router.post(
  "/",
  passport.authenticate("current", { session: false }),
  verifyRole(["admin", "premium"]),
  productControllerInstance.addProduct
);
router.put("/:pid", productControllerInstance.updateProduct);
router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  verifyRole(["admin", "premium"]),
  productControllerInstance.deleteProduct
);

module.exports = router;
