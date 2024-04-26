const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const generateToken = require("../utils/jsonwebtoken.js");

// JWT
// Register with JWT
router.post("/", async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).send("The email already registered");
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role,
    });

    // Create token
    const token = generateToken({ id: newUser._id });

    console.log("token generated", token);
    res.cookie("ecommerceCookie", token, { maxAge: 3600000, httpOnly: true });

    res.redirect("/login");
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Login with JWT
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send("The email does not exist");
    }

    if (!isValidPassword(password, user)) {
      return res.status(401).send("The password is invalid");
    }

    const token = generateToken({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      rol: user.role,
      id: user._id,
    });

    res.cookie("ecommerceCookie", token, { maxAge: 3600000, httpOnly: true });

    res.redirect("/api/sessions/current");
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "There is not user authenticated" });
    }
    const user = req.user;
    res.status(200).json(user);
  }
);

//Logout:
router.post("/logout", (req, res) => {
  res.clearCookie("ecommerceCookie");
  res.redirect("/login");
});

module.exports = router;
