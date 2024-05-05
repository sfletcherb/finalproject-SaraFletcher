const express = require("express");
const router = express.Router();
const passport = require("passport");
const userControllerInstance = require("../controllers/userManager.js");

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

router.all("/logout", userControllerInstance.logout);

module.exports = router;
