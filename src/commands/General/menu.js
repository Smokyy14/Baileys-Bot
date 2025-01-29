module.exports = {
  name: "menu",
  alias: ["m"], 
  category: "Comandos",
  use: "/menu",
  description: "Despliega la lista de comandos.",
    
  async execute(sock, msg, _) {
    const commands = sock.commands.filter(({ dev }) => !dev ); // Filtra los comandos con el campo "dev: true,"
    const jid = msg.messages[0].key.remoteJid;

    if (!commands.size) {
      return msg.reply("Sin comandos para mostrar.");
    }

      const categorized = commands.reduce((previous, current) => {
      const category = current.category || "Sin categoría";
      const subcategory = current.subcategory || null;

      if (!previous[category]) {
        previous[category] = {};
      }

      if (subcategory) {
        if (!previous[category][subcategory]) {
          previous[category][subcategory] = [];
        }
        previous[category][subcategory].push(current);
      } else {
        if (!previous[category]["Sin subcategoría"]) {
          previous[category]["Sin subcategoría"] = [];
        }
        previous[category]["Sin subcategoría"].push(current);
      }

      return previous;
    }, {});

    let text = `Tengo *${commands.size}* comandos para tu uso:\n`;

    for (const [category, subcategories] of Object.entries(categorized)) {
      text += `\n> ------------------------\n`;
      text += `\n*${category}:*\n`;

      for (const [subcategory, commands] of Object.entries(subcategories)) {
        if (subcategory !== "Sin subcategoría") {
          text += `      *${subcategory}*:\n`;
        }
        const list = commands.map(({ name }) => `\t\t\`/${name}\``).join("\n");
        text += `${list}\n`;
      }
    }

    text += `\n> ------------------------\n`;
    
    await msg.reply(text)
  },
};