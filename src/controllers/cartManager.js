const { response } = require("express");
const cartRepositoryInstance = require("../repositories/carts.repository.js");

class CartController {
  async createCart(req, res) {
    try {
      const cart = await cartRepositoryInstance.createCart();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async getAllCarts(req, res) {
    const limit = req.query.limit;

    try {
      const data = await cartRepositoryInstance.getAllCarts();
      if (limit && !isNaN(parseInt(limit))) {
        res.json(data.slice(0, limit));
      } else {
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;
    try {
      const cartById = await cartRepositoryInstance.getCartById(cartId);
      if (!cartById) {
        res.status(404).json({ error: "cart not found" });
      }
      res.status(200).json(cartById);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const idProduct = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
      const upDateCart = await cartRepositoryInstance.addProductToCart(
        cartId,
        idProduct,
        quantity
      );
      res.status(200).json(upDateCart);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async updateProductCart(req, res) {
    const newQuantity = req.body.quantity || 1;
    const idProduct = req.params.pid;
    const cartId = req.params.cid;
    try {
      const updateCart = await cartRepositoryInstance.updateProductCart(
        cartId,
        idProduct,
        newQuantity
      );
      res.status(200).json(updateCart);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async updateProductCartWithArray(req, res) {
    const cartId = req.params.cid;
    const newArray = req.body;
    try {
      const updateCartWithArray =
        await cartRepositoryInstance.updateProductCartWithArray(
          cartId,
          newArray
        );
      res.status(200).json(updateCartWithArray);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async deleteProductCart(req, res) {
    const cartId = req.params.cid;
    const idProduct = req.params.pid;

    try {
      const deleteProductInCart =
        await cartRepositoryInstance.deleteProductCart(cartId, idProduct);
      res.status(200).json({
        status: "success",
        message: "Product has been deleted",
        deleteProductInCart,
      });
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async deleteAllProductsCart(req, res) {
    const cartId = req.params.cid;
    try {
      const deleteAllProductsInCart =
        await cartRepositoryInstance.deleteAllProductsCart(cartId);
      res.status(200).json(deleteAllProductsInCart);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }
}

const cartControllerInstance = new CartController();

module.exports = cartControllerInstance;
