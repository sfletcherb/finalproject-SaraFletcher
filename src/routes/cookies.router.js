const express = require("express");
const router = express.Router();

//Cookie Routes:
router.get("/setCookie", (req, res) => {
  res
    .cookie("coderCookie", "my first cookie", { maxAge: 10000 })
    .send("my first cookie!");
});
router.get("/getCookie", (req, res) => {
  res.send(req.cookies); // if I only want a specific cookie req.cookies.nombre_de_la_cookie
});
router.get("/deleteCookie", (req, res) => {
  res.clearCookie("coderCookie").send("Cookie deleted");
});
router.get("/signedCookie", (req, res) => {
  res
    .cookie("signedCookie", "my first signed cookie", { signed: true })
    .send("my first signed cookie!");
});
router.get("/recoverySignedCookie", (req, res) => {
  const valueCookie = req.signedCookies.signedCookie; // name of the signed cookie "signedCookie"
  if (valueCookie) {
    res.send("recovered cookie");
  } else {
    res.send("invalid Cookie");
  }
});

module.exports = router;
