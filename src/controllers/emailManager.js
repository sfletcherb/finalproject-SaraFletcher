const nodemailer = require("nodemailer");
const configObject = require("../config/dotenv.js");
const ticketRepositoryInstance = require("../repositories/ticket.repository.js");

const { nodemailer_user, nodemailer_password } = configObject;

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: nodemailer_user,
    pass: nodemailer_password,
  },
});

class EmailController {
  async sendEmail(req, res) {
    const user = req.user;

    try {
      const dataTicket = await ticketRepositoryInstance.getTicket(user.email);

      await transport.sendMail({
        from: "ecommerce Test <saflebri@gmail.com>",
        to: "saflebri@hotmail.com",
        subject: `Confirmación de orden No. ${dataTicket.code}`,
        html: ` <div class="container">
        <div class="header">
            <h1>Confirmación de Compra</h1>
        </div>
        <div class="">
            <h1>¡Gracias por tu compra, ${user.first_name}!</h1>
            <p>Estamos encantados de confirmar tu pedido. A continuación, encontrarás los detalles de tu compra:</p>
            <p><strong>Código de pedido:</strong> ${dataTicket.code}</p>
            <p><strong>Fecha pedido:</strong>${dataTicket.purchase_datetime}</p>
            <p><strong>Total:</strong> $ ${dataTicket.amount}</p>
            <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en <a href="">contactarnos</a>.</p>
            <p>Puedes revisar el estado de tu pedido en cualquier momento haciendo clic en el siguiente botón:</p>
            <a href="" class="">Ver mi Pedido</a>
        </div>
        <div class="">
            <p>&copy; 2024 Ecommerce. Todos los derechos reservados.</p>
        </div>
    </div>`,
      });
      res.send("email sent correctly");
    } catch (error) {
      res.status(500).send("error sending email");
    }
  }
}

const emailControllerInstance = new EmailController();

module.exports = emailControllerInstance;
