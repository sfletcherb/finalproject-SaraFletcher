const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const { mode } = program.opts();

dotenv.config({
  path: mode === "production" ? "./.env.production" : "./.env.development",
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  admin_name: process.env.ADMIN_NAME,
  admin_password: process.env.ADMIN_PASSWORD,
};

module.exports = configObject;
