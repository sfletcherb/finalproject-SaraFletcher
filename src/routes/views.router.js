const express = require("express");
const router = express.Router();
const ProductModel = require("../models/products.model.js");
const passport = require("passport");

router.get("/", async (req, res) => {
  try {
    const data = await ProductModel.find();

    const newArray = data.map((p) => {
      return {
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        code: p.code,
        category: p.category,
        status: p.status,
        thumbnail: p.thumbnail,
      };
    });

    res.render("index", { data: newArray });
  } catch (error) {
    console.log("error to load list of products");
    res.status(500).send("error loading products");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", async (req, res) => {
  res.render("chat");
});

router.get("/products", async (req, res) => {
  try {
    let query = {};
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || "asc";

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.stockIn) {
      query.stock = { $gt: 1 };
    }

    if (req.query.stockOut) {
      query.stock = { $eq: 0 };
    }

    const sortQuery = {};
    if (sort === "asc" || sort === "desc") {
      sortQuery.price = sort === "asc" ? 1 : -1;
    } else {
      sortQuery.price = 1;
    }

    const productList = await ProductModel.paginate(query, {
      limit: limit,
      page: page,
      sort: sortQuery,
    });

    const finalResultProductList = productList.docs.map((item) => {
      const { _id, ...rest } = item.toObject();
      return { _id, ...rest };
    });

    res.render("products", {
      status: finalResultProductList || productList ? "success" : "error",
      payload: finalResultProductList,
      totalPages: productList.totalPages,
      prevPage: productList.prevPage,
      nextPage: productList.nextPage,
      page: productList.page,
      hasPrevPage: productList.hasPrevPage,
      hasNextPage: productList.hasNextPage,
      queryString: req.originalUrl.split("?")[1],
      prevLink: productList.hasPrevPage
        ? `/products?page=${productList.prevPage}&limit=${limit}&${
            req.originalUrl.split("?")[1]
          }`
        : null,
      nextLink: productList.hasNextPage
        ? `/products?page=${productList.nextPage}&limit=${limit}&${
            req.originalUrl.split("?")[1]
          }`
        : null,
      user: req.user,
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
