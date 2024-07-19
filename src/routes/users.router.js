const express = require("express");
const router = express.Router();
const passport = require("passport");
const userControllerInstance = require("../controllers/userManager.js");
const uploader = require("../middleware/uploadMulter.js");

// JWT
// Register with JWT
router.post("/", userControllerInstance.userRegister);

// Login with JWT
router.post("/login", userControllerInstance.userLogin);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  userControllerInstance.current
);

router.post(
  "/resetPasswordRequest",
  userControllerInstance.resetPasswordRequest
);

router.post("/password", userControllerInstance.password);

router.post("/premium/:uid", userControllerInstance.changeRole);

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
