const crypto = require("crypto");

function generateRandomToken(length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString("hex"));
      }
    });
  });
}

module.exports = generateRandomToken;
