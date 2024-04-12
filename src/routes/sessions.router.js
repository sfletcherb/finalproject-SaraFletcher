const express = require("express");
const router = express.Router();
const passport = require("passport");

//Version for passport

//Register
router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedregister",
  }),
  async (req, res) => {
    if (!req.user) return res.status(401).send("Password not valid");

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/failedregister", async (req, res) => {
  res.send("failed registration");
});

//Login
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user) return res.status(401).send("Password not valid");

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/faillogin", async (req, res) => {
  res.send("failed logging");
});

//Logout
router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy((err) => {
      if (err) res.send("Error in logout", err);
    });
  }
  res.redirect("/login");
});

// Version for GitHub

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
  }
);

module.exports = router;
