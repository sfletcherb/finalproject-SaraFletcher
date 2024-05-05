const express = require("express");
const router = express.Router();
const viewsControllerInstance = require("../controllers/viewManager.js");

router.get("/", viewsControllerInstance.indexView);

router.get("/realtimeproducts", viewsControllerInstance.realTimeProducts);

router.get("/chat", viewsControllerInstance.chat);

router.get("/products", viewsControllerInstance.products);

router.get("/register", viewsControllerInstance.register);

router.get("/login", viewsControllerInstance.login);

module.exports = router;
