const CartModel = require("../models/carts.model.js");

class CartService {
  async createCart() {
    try {
      const cart = new CartModel({
        products: [],
      });

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllCarts() {
    try {
      const data = await CartModel.find();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCartById(id) {
    try {
      const cartById = await CartModel.findById(id);
      return cartById.products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addProductToCart(cartId, idProduct, quantity) {
    try {
      const existCart = await CartModel.findById(cartId);
      if (!existCart) {
        throw new Error("Cart not found");
      }

      const existProductIndex = existCart.products.findIndex(
        (p) => p.product._id.toString() === idProduct
      );

      if (existCart && existProductIndex !== -1) {
        existCart.products[existProductIndex].quantity += quantity;
      } else {
        existCart.products.push({
          product: idProduct,
          quantity,
        });
      }
      // When cart is modified, we need to use .markModified
      existCart.markModified("products");
      await existCart.save();
      return existCart.products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProductCart(cartId, idProduct, newQuantity) {
    try {
      const existCart = await CartModel.findById(cartId);

      if (!existCart) {
        throw new Error("Cart not found");
      }

      const indexProduct = existCart.products.findIndex(
        (p) => p.product._id.toString() === idProduct
      );

      if (indexProduct !== -1) {
        existCart.products[indexProduct].quantity = newQuantity;
      } else {
        throw new Error("Product not found");
      }

      existCart.markModified("products");
      await existCart.save();
      return existCart.products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProductCartWithArray(cartId, data) {
    try {
      const existingCart = await CartModel.findById(cartId);
      if (!existingCart) {
        throw new Error("Cart not found");
      }

      existingCart.products.push(...data);

      existingCart.markModified("products");
      await existingCart.save();
      return existingCart.products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProductCart(cartId, idProduct) {
    try {
      const existCart = await CartModel.findById(cartId);

      if (!existCart) {
        throw new Error("Cart not found");
      }

      const indexProduct = existCart.products.findIndex(
        (p) => p.product._id.toString() === idProduct
      );

      if (indexProduct !== -1) {
        existCart.products.splice(indexProduct, 1);
        await existCart.save();
        return existCart;
      } else {
        throw new Error("Product does not exist in cart");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteAllProductsCart(cartId) {
    try {
      const existCart = await CartModel.findById(cartId);
      if (!existCart) {
        throw new Error("Cart not found");
      } else {
        existCart.products = [];
        await existCart.save();
        return existCart;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const cartServiceInstance = new CartService();
module.exports = cartServiceInstance;
