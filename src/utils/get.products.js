const productControllerInstance = require("../controllers/productManager.js");
const cartControllerInstance = require("../controllers/cartManager.js");
const CartModel = require("../models/carts.model.js");

const deleteProduct = async (id) => {
  try {
    await productControllerInstance.deleteProduct(id);
  } catch (error) {
    console.log("Error reading file", error);
    throw error;
  }
};

const addProduct = async (data) => {
  try {
    await productControllerInstance.addProduct(data);
  } catch (error) {
    console.log("Error reading file", error);
    throw error;
  }
};

const addProductInCart = async (idProduct, quantity = 1) => {
  try {
    let existingCart = await CartModel.findOne();

    if (!existingCart) {
      const newCart = await cartControllerInstance.createCart();
      await cartControllerInstance.addProductToCart(
        newCart._id,
        idProduct,
        quantity
      );
    } else {
      const existingProduct = existingCart.products.find(
        (item) => item._id === idProduct
      );
      if (existingProduct) {
        await cartControllerInstance.updateProductCart(
          existingCart._id,
          idProduct,
          quantity
        );
      } else {
        await cartControllerInstance.addProductToCart(
          existingCart._id,
          idProduct,
          quantity
        );
      }
    }
  } catch (error) {
    console.log("Error adding product in Cart", error);
    throw error;
  }
};

module.exports = { deleteProduct, addProduct, addProductInCart };
