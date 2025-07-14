const { Dropbox } = require("dropbox");
const ndfetch = require("node-fetch");
require("dotenv").config();
async function getdbxClient() {
  const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: process.env.dbxRefreshToken,
      grant_type: "refresh_token",
      client_id: process.env.dbxClientId,
      client_secret: process.env.dbxClientSecret,
    }),
  });
  const data = await res.json();
  const accessToken = data.access_token;
  return new Dropbox({ accessToken });
}

module.exports = { getdbxClient };
