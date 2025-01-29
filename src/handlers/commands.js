const { readdir } = require("fs/promises");

module.exports = async (sock) => {
  const directory = await readdir("./src/commands");

  for (const folder of directory) {
    const files = await readdir(`./src/commands/${folder}`);

    for (const file of files) {
      if (!file.endsWith(".js")) continue;

      delete require.cache[require.resolve(`../commands/${folder}/${file}`)];

      const command = require(`../commands/${folder}/${file}`);
      sock.commands.set(command.name, command);
    }
  }

  console.log(`${sock.commands.size} comandos listos para ejecutarse.`);
};
