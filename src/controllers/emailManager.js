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
    const email = user.email;

    try {
      const dataTicket = await ticketRepositoryInstance.getTicket(email);

      await transport.sendMail({
        from: "ecommerce Test <saflebri@gmail.com>",
        to: email,
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
    </div>
    /* <img src="cid:logo1"> */`,
        /* attachments: [{
          filename: "logo.jpg",
          path: "./src/img/logo.jpg",
          cid: "logo1"
        }] */
      });
      res.render("success", {
        layout: "main",
        title: "Purchase Success",
        message: "The purchase has been done successfully.",
        redirectUrl: "/products",
      });
    } catch (error) {
      res.status(500).send("error sending email purchase");
    }
  }

  async sendResetEmail(email, first_name, token) {
    try {
      const mailOptions = {
        from: "ecommerce Test <saflebri@gmail.com>",
        to: email,
        subject: `Reset email`,
        html: `
        <p>Hola ${first_name},</p>
        <p>Recibiste este correo porque solicitaste restablecer tu contraseña.</p>
        <p>Para continuar con el proceso, haz clic en el siguiente enlace:</p>
        <a href="http://localhost:8080/password/${token}">Restablecer contraseña</a>
        <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>
        <p>Gracias,</p>
        <p>Tu equipo de soporte</p>
    `,
      };

      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  }

  async deleteUserEmail(email) {
    try {
      const mailOptions = {
        from: "ecommerce Test <saflebri@gmail.com>",
        to: email,
        subject: `Notificación de Eliminación de Cuenta por Inactividad`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Estimado usuario,</p>
          <p>Nos dirigimos a ti para informarte que, debido a la falta de actividad en tu cuenta durante los últimos 2 días, hemos procedido a eliminarla de nuestra plataforma.</p>
          <p>Si crees que esto es un error o si deseas reactivar tu cuenta, te invitamos a ponerte en contacto con nuestro equipo de soporte lo antes posible.</p>
          <p>Estamos aquí para ayudarte y lamentamos cualquier inconveniente que esto pueda causarte.</p>
          <p>Saludos cordiales,</p>
          <p>El equipo de soporte de ecommerce Test</p>
        </div>
        `,
      };

      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  }
}

const emailControllerInstance = new EmailController();

module.exports = emailControllerInstance;
