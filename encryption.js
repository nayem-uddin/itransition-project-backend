const cryptoJS = require("crypto-js");
require("dotenv").config();
function encrypt(password) {
  const passEncrypted = cryptoJS.HmacSHA512(password, process.env.SECRET_KEY);
  return passEncrypted.toString();
}

module.exports = { encrypt };
