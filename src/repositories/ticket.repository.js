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

  async getTicket(userEmail) {
    try {
      const dataTickets = await TicketModel.find({ purchaser: userEmail })
        .sort({ purchase_datetime: -1 })
        .exec();

      if (dataTickets.length === 0) {
        throw new Error("Ticket not found for the given email");
      }

      // Take the first ticket
      const latestTicket = dataTickets[0];
      return latestTicket;
    } catch (error) {
      throw new Error(`Error retrieving ticket: ${error.message}`);
    }
  }
}

const ticketRepositoryInstance = new TicketRepository();
module.exports = ticketRepositoryInstance;
