const express = require("express");
const router = express.Router();
const passport = require("passport");
const verifyRole = require("../middleware/authMiddleware.js");
const viewsControllerInstance = require("../controllers/viewManager.js");

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

router.get(
  "/users",
  passport.authenticate("current", { session: false }),
  verifyRole(["admin"]),
  viewsControllerInstance.getUsers
);

router.get("/", viewsControllerInstance.login);

router.get("/login-register", viewsControllerInstance.login);

router.get("/reset-password", viewsControllerInstance.resetPassword);

router.get("/password/:token", viewsControllerInstance.password);

router.get("/changeRole/:uid", viewsControllerInstance.changeRole);

router.get("/success", viewsControllerInstance.success);

router.get("/upload/:uid", viewsControllerInstance.upload);

module.exports = router;
