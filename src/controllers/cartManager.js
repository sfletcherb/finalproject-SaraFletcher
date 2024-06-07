const { response, request } = require("express");
const cartRepositoryInstance = require("../repositories/carts.repository.js");

class CartController {
  async createCart(req, res) {
    try {
      const cart = await cartRepositoryInstance.createCart();
      if (!cart) {
        req.logger.error("Failed to create cart: cart is null or invalid");
        return res
          .status(500)
          .send({ status: "error", message: "Failed to create cart" });
      }
      req.logger.info("Cart created");
      res.status(200).json(cart);
    } catch (error) {
      req.logger.error(`Error creating cart: ${error.message}`);
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async getAllCarts(req, res) {
    const limit = req.query.limit;

    try {
      const data = await cartRepositoryInstance.getAllCarts();
      req.logger.debug(`Received data: ${data}`);
      if (limit && !isNaN(parseInt(limit))) {
        res.json(data.slice(0, limit));
      } else {
        req.logger.info("Received data successfully");
        res.status(200).json(data);
      }
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async getCartById(req, res) {
    const cartId = req.params.cid;
    req.logger.debug(`Current Cart ID: ${cartId}`);
    try {
      const cartById = await cartRepositoryInstance.getCartById(cartId);
      if (!cartById) {
        req.logger.error(`Cart ${cartId} not found`);
        res.status(404).json({ error: "cart not found" });
      }
      req.logger.info(`Cart Id is ${cartId}`);
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
      req.logger.info("Product added to cart");
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
      req.logger.debug("Elements updated in cart: " + updateCart);
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
      req.logger.info("Product deleted");
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
