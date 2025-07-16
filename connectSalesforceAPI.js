const { OAuth2, Connection } = require("jsforce");
require("dotenv").config();
const conn = new Connection({
  instanceUrl: process.env.sfInstanceURL,
  refreshFn: async (conn, callback) => {
    try {
      await conn.login(process.env.sfUsername, process.env.sfPassword);
      if (!conn.accessToken) {
        throw new Error("Access token not found after login");
      }
      callback(null, conn.accessToken);
    } catch (err) {
      if (err instanceof Error) {
        callback(err);
      } else {
        throw err;
      }
    }
  },
});

module.exports = { conn };
