const express = require("express");
const PRODUCTS_JSON = require("../utils/faker.js");
const router = express.Router();

router.get("/mockingproducts", (req, res) => {
  res.json(JSON.parse(PRODUCTS_JSON));
});

module.exports = router;
