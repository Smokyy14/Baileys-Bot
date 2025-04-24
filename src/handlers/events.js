const { readdir } = require("fs/promises");

module.exports = async (sock) => {
  const folder = await readdir("./src/events");

  for (const file of folder) {
    if (!file.endsWith(".js")) continue;

    const event = require(`../events/${file}`);

    sock.ev.on(event.name, (...args) => {
      event.load(...args, sock);
    });
  }

  console.log("Events loaded correctly");
};
