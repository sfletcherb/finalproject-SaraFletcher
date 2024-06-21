const swaggerJsdoc = require("swagger-jsdoc");

// Define options for swagger Jsdoc
const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce Application Documentation",
      description: "Web app for ecommerce pharmaceutical products",
    },
  },
  servers: [
    {
      url: "https://localhost:8080",
      description: "Local server",
    },
  ],
  apis: ["./src/docs/**/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
