const express = require("express");
const router = express.Router();
const passport = require("passport");
const verifyRole = require("../middleware/authMiddleware.js");
const ticketControllerInstance = require("../controllers/ticketManager.js");

router.get(
  "/",
  passport.authenticate("current", { session: false }),
  verifyRole(["admin", "user"]),
  ticketControllerInstance.createTicket
);
module.exports = router;
