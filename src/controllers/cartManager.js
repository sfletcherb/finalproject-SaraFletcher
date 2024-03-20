const CartModel = require("../models/carts.model.js");

class CartManager {
  async createCart() {
    try {
      const cart = new CartModel({
        products: [],
      });

      await cart.save();
      return cart;
    } catch (error) {
      console.log("couldn't create cart", error);
    }
  }

  async getProductById(id) {
    try {
      const cartById = await CartModel.findById(id);
      return cartById.products;
    } catch (error) {
      console.log("Couldn't find cart", error);
    }
  }

  async addProductToCart(idCart, idProduct, quantity) {
    try {
      const existCart = await CartModel.findById(idCart);
      if (!existCart) {
        console.log("Cart not found");
        return;
      }

      const existProductIndex = existCart.products.findIndex(
        (p) => p.product.toString() === idProduct
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
      console.log("product added to cart");
      return existCart.products;
    } catch (error) {
      console.log({ status: "error", message: error.message });
    }
  }

  async updateProductCart(idCart, idProduct, quantity) {
    try {
      const existingCart = await CartModel.findById(idCart);

      if (!existingCart) {
        console.log("Cart not found");
      }

      const existingProduct = existingCart.products.findIndex(
        (p) => p.product.toString() === idProduct
      );

      if (existingProduct !== -1) {
        existingCart.products[existingProduct].quantity = quantity;
      } else {
        console.log("Product not found");
      }

      existingCart.markModified("products");
      await existingCart.save();
      console.log("product updated successfully");
      return existingCart.products;
    } catch (error) {
      console.log({ status: "error", message: error.message });
    }
  }

  async updateProductCartWithArray(idCart, data) {
    try {
      const existingCart = await CartModel.findById(idCart);

      if (!existingCart) {
        console.log("Cart not found");
        return null;
      }

      existingCart.products.push(...data);

      existingCart.markModified("products");
      await existingCart.save();
      console.log("product updated successfully with new array");
      return existingCart.products;
    } catch (error) {
      console.log({ status: "error", message: error.message });
    }
  }

  async deleteProductCart(idCart, idProduct) {
    try {
      const existCart = await CartModel.findById(idCart);

      if (!existCart) {
        console.log("Cart not found");
        return;
      }

      const indexProduct = existCart.products.findIndex(
        (p) => p.product == idProduct
      );

      if (indexProduct !== -1) {
        existCart.products.splice(indexProduct, 1);
        await existCart.save();
        console.log("product delected successfully from cart");
        return existCart;
      } else {
        console.log("Product does not exist in cart");
      }
    } catch (error) {
      console.log("error deleting", error.message);
    }
  }

  async deleteAllProductsCart(idCart) {
    try {
      const existCart = await CartModel.findById(idCart);

      if (!existCart) {
        console.log("Cart not found");
      } else {
        existCart.products = [];
        await existCart.save();
        console.log("All products have been deleted in cart");
        return existCart;
      }
    } catch (error) {
      console.log("error deleting", error.message);
    }
  }
}

const cartManagerInstance = new CartManager();

module.exports = cartManagerInstance;
