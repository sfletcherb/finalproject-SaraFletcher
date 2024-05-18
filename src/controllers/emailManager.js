const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "saflebri@gmail.com",
    pass: "lbyp hqfx ipgk vjxf",
  },
});

class EmailController {
  async sendEmail(res, req) {
    try {
      await transport.sendEmail({
        from: "ecommerce Test <saflebri@gmail.com>",
        to: "saflebri@hotmail.com",
        subject: "correo de prueba",
        html: `<h1>Correo de Prueba</h1>
               <img src="cid: "/>
        `,
        attachments: [
          {
            filename: "",
            path: "",
            cid: "",
          },
        ],
      });
      res.send("email sented correctly");
    } catch (error) {
      res.status(500).send("error sending email");
    }
  }
}

const emailControllerInstance = new EmailController();

module.exports = emailControllerInstance;
