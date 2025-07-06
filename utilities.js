const cryptoJS = require("crypto-js");
require("dotenv").config();

function destructureProps(adminInfo) {
  const { fullName, username, email, password } = adminInfo;
  return { fullName, username, email, password };
}

function getSelectedIDs(list) {
  return list.map((item) => item.id);
}

function encrypt(password) {
  const passEncrypted = cryptoJS.HmacSHA512(password, process.env.SECRET_KEY);
  return passEncrypted.toString();
}

const CASCADE = "CASCADE";
const frontEndUrl = [
  "https://itransition-project-frontend.vercel.app",
  "http://localhost:5173",
  "https://itransition-project.netlify.app",
];
module.exports = {
  destructureProps,
  getSelectedIDs,
  encrypt,
  CASCADE,
  frontEndUrl,
};
