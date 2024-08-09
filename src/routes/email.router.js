const express = require("express");
const router = express.Router();
const passport = require("passport");
const verifyRole = require("../middleware/authMiddleware.js");
const emailControllerInstance = require("../controllers/emailManager.js");

router.get(
  "/mail",
  passport.authenticate("current", { session: false }),
  verifyRole(["admin", "user", "premium"]),
  emailControllerInstance.sendEmail
);

module.exports = router;
