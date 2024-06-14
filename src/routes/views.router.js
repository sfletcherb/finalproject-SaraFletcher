const express = require("express");
const router = express.Router();
const passport = require("passport");
const verifyRole = require("../middleware/authMiddleware.js");
const viewsControllerInstance = require("../controllers/viewManager.js");

router.get("/", viewsControllerInstance.indexView);

router.get(
  "/realtimeproducts",
  passport.authenticate("current", { session: false }),
  verifyRole(["admin", "premium"]),
  viewsControllerInstance.realTimeProducts
);

router.get(
  "/chat",
  passport.authenticate("current", { session: false }),
  verifyRole(["user"]),
  viewsControllerInstance.chat
);

router.get(
  "/products",
  passport.authenticate("current", { session: false }),
  viewsControllerInstance.products
);

router.get("/register", viewsControllerInstance.register);

router.get("/login", viewsControllerInstance.login);

module.exports = router;
