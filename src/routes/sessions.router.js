const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age, role } = req.body;
  try {
    const userExists = await UserModel.findOne({ email: email });
    if (userExists) {
      return res.status(400).send("Email already exists");
    }
    //Create a new user
    const newUser = await UserModel.create({
      first_name: first_name,
      last_name: last_name,
      email,
      password,
      age,
      role,
    });

    //Create session
    req.session.login = true;
    req.session.user = { ...newUser._doc };

    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      if (existUser.password === password) {
        req.session.login = true;
        req.session.user = {
          first_name: existUser.first_name,
          last_name: existUser.last_name,
          email: existUser.email,
          age: existUser.age,
          role: existUser.role,
        };

        // Validating admin role
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          req.session.admin = true;
        } else {
          req.session.admin = false;
        }

        res.redirect("/products");
      } else {
        res.status(401).send("Password not valid");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy((err) => {
      if (err) res.send("Error in logout", err);
    });
  }
  res.redirect("/login");
});

module.exports = router;
