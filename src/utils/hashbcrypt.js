const bcrypt = require("bcrypt");

// Create Hash: Apply hasheo to password
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Validate password registered in BD against password registered by user. Return true or false depending
const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

module.exports = { createHash, isValidPassword };
