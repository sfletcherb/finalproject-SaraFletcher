const mongoose = require("mongoose");
const ticketRepositoryInstance = require("../repositories/ticket.repository.js");
const cartRepositoryInstance = require("../repositories/carts.repository.js");
const productRepositoryInstance = require("../repositories/products.repository.js");

class TicketController {
  constructor() {
    this.createTicket = this.createTicket.bind(this);
    this.processTicket = this.processTicket.bind(this);
  }

  async createTicket(req, res) {
    const userEmail = req.user.email;
    const userCartId = req.user.cart;
    console.log("User Email:", userEmail);
    console.log("User Cart ID:", userCartId);

    // Validar el ObjectId antes de usarlo
    if (!mongoose.Types.ObjectId.isValid(userCartId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Cart ID" });
    }

    try {
      const cartById = await cartRepositoryInstance.getCartById(userCartId);
      if (!cartById) {
        console.log("Cart not found for ID:", userCartId);
        return res
          .status(404)
          .json({ status: "error", message: "Cart not found" });
      }
      console.log("Cart Retrieved:", cartById);

      const productById = await productRepositoryInstance.getAllProducts();
      console.log("Products Retrieved:", productById);

      const { total, purchaseUncompleted } = await this.processTicket(
        cartById,
        productById
      );
      console.log("Total:", total);
      console.log("Purchase Uncompleted:", purchaseUncompleted);

      // Filter products not purchased and update cart
      const productsNotPurchased = cartById.filter((item) => {
        return purchaseUncompleted.some(
          (uncompleted) => uncompleted._id.toString() === item._id.toString()
        );
      });
      console.log("Products Not Purchased:", productsNotPurchased);

      await cartRepositoryInstance.deleteAllProductsCart(userCartId);
      console.log("Cart Products Deleted");
      await cartRepositoryInstance.updateProductCartWithArray(
        userCartId,
        productsNotPurchased
      );
      console.log("Cart Updated");

      const newTicket = await ticketRepositoryInstance.createTicket(
        userEmail,
        total
      );
      console.log("New Ticket Created:", newTicket);

      res.status(200).json(newTicket);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async processTicket(cartItems, products) {
    console.log("Processing Ticket");
    console.log("Cart Items:", cartItems);
    console.log("Products:", products);

    let total = 0;
    let purchaseUncompleted = [];

    try {
      for (const item of cartItems) {
        console.log("Processing Item:", item);
        if (item.product?.price && item.quantity) {
          const dataProduct = products.find(
            (product) => product._id.toString() === item.product._id.toString()
          );

          // Validation of stock product
          if (dataProduct) {
            if (dataProduct.stock >= item.quantity) {
              dataProduct.stock -= item.quantity;

              // Update stock data product
              await productRepositoryInstance.updateProduct(
                dataProduct._id.toString(),
                dataProduct
              );
              total += item.product.price * item.quantity;
            } else {
              purchaseUncompleted.push(item);
              console.log(`Do not have enough stock for ${item.product._id}`);
            }
          } else {
            purchaseUncompleted.push(item);
            console.log(`Do not found product with ID ${item.product._id}`);
          }
        }
      }
    } catch (error) {
      console.error("Error in processTicket:", error);
      throw error; // Re-throw to be caught by the caller
    }
    console.log("Total:", total);
    console.log("Purchase Uncompleted:", purchaseUncompleted);
    return { total, purchaseUncompleted };
  }
}

const ticketControllerInstance = new TicketController();
module.exports = ticketControllerInstance;
