const TicketModel = require("../models/ticket.model.js");

class TicketRepository {
  async createTicket(userEmail, amount) {
    try {
      const ticket = new TicketModel({
        amount: amount,
        purchaser: userEmail,
      });
      await ticket.save();
      return ticket;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const ticketRepositoryInstance = new TicketRepository();
module.exports = ticketRepositoryInstance;
