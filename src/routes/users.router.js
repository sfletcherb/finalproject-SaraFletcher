const express = require("express");
const router = express.Router();
const passport = require("passport");
const userControllerInstance = require("../controllers/userManager.js");
const uploader = require("../middleware/uploadMulter.js");
const verifyRole = require("../middleware/authMiddleware.js");

// JWT
// Register with JWT
router.post("/", userControllerInstance.userRegister);

// Login with JWT
router.post("/login-register", userControllerInstance.userLogin);

router.get(
  "/getAllUsers",
  passport.authenticate("current", { session: false }),
  verifyRole(["admin"]),
  userControllerInstance.getAllUsers
);

router.post(
  "/resetPasswordRequest",
  userControllerInstance.resetPasswordRequest
);

router.post("/password", userControllerInstance.password);

router.post("/premium/:uid", userControllerInstance.changeRole);

router.delete("/deleteUser/:uid", userControllerInstance.deleteUser);

router.post(
  "/:uid/documents",
  uploader.array("files", 3),
  userControllerInstance.upload
);

router.all(
  "/logout",
  passport.authenticate("current", { session: false }),
  userControllerInstance.logout
);

module.exports = router;
