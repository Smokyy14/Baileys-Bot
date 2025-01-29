const { DisconnectReason } = require("@whiskeysockets/baileys");
const { connectToWA } = require("../index.js");
const { Boom } = require("@hapi/boom");

module.exports = {
  name: "connection.update",

  async load(update) {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const error = lastDisconnect.error;
      const isBoomError = error instanceof Boom;
      const isLoggedIn = error.output.statusCode !== DisconnectReason.loggedOut;

      console.log("Conexión cerrada debido a:", error);

      if (isBoomError && isLoggedIn) {
        await connectToWA();
      }
    } else if (connection === "open") {
      console.log("Sesión iniciada correctamente.");
    }
  },
};
