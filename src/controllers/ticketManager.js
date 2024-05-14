const ticketRepositoryInstance = require("../repositories/ticket.repository.js");
const cartRepositoryInstance = require("../repositories/carts.repository.js");

class TicketController {
  async createTicket(req, res) {
    const userEmail = req.user.email;
    const userCartId = req.user.cart;

    const cartById = await cartRepositoryInstance.getCartById(userCartId);

    const totalAmount = (cartById) => {
      let total = 0;
      cartById.forEach((item) => {
        if (item.product && item.product.price && item.quantity) {
          total += item.product.price * item.quantity;
        }
      });
      return total;
    };

    const amount = totalAmount(cartById);

    try {
      const newTicket = await ticketRepositoryInstance.createTicket(
        userEmail,
        amount
      );
      res.status(200).json(newTicket);
    } catch (error) {
      res.status(500).send({ status: "error", message: error.message });
    }
  }
}

const ticketControllerInstance = new TicketController();
module.exports = ticketControllerInstance;
