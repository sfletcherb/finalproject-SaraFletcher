const mongoose = require("mongoose");

function generateRandomCode(length) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

const ticketSchema = new mongoose.Schema({
  code: {
    type: "string",
    required: true,
    undefined: true,
    default: () => generateRandomCode(8),
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: "number",
    required: true,
  },
  purchaser: {
    type: "string",
    required: true,
  },
});

const TicketModel = mongoose.model("tickets", ticketSchema);
module.exports = TicketModel;
