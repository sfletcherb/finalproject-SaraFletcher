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

    try {
      const cartById = await cartRepositoryInstance.getCartById(userCartId);
      const productById = await productRepositoryInstance.getAllProducts();
      const { total, purchaseUncompleted } = await this.processTicket(
        cartById,
        productById
      );

      // Filter products not purchased and update cart
      const productsNotPurchased = cartById.filter((item) => {
        return purchaseUncompleted.some(
          (uncompleted) => uncompleted._id.toString() === item._id.toString()
        );
      });

      await cartRepositoryInstance.deleteAllProductsCart(userCartId);
      await cartRepositoryInstance.updateProductCartWithArray(
        userCartId,
        productsNotPurchased
      );

      const newTicket = await ticketRepositoryInstance.createTicket(
        userEmail,
        total
      );

      res.status(200).json(newTicket);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }

  async processTicket(cartItems, products) {
    let total = 0;
    let purchaseUncompleted = [];

    for (const item of cartItems) {
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
              dataProduct._id,
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
    return { total, purchaseUncompleted };
  }
}

const ticketControllerInstance = new TicketController();
module.exports = ticketControllerInstance;
