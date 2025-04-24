const { readdir } = require("fs/promises");

module.exports = async (sock) => {
  const directory = await readdir("./src/components");

  for (const file of directory) {
    if (!file.endsWith(".js")) continue;

    const component = require(`../components/${file}`);
    if (!component) continue;

    sock.components.set(component.id, component);
  }

  console.log("Components ready.");
};
