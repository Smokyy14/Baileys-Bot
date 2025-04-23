module.exports = {
  name: "menu",
  alias: ["m"], 
  category: "General",
  use: "/menu",
  description: "Shows the command menu.",
    
  async execute(sock, msg, _) {
    const commands = sock.commands.filter(({ dev }) => !dev ); // Filters commands with the "dev: true" field
    const jid = msg.messages[0].key.remoteJid;

    if (!commands.size) {
      return msg.reply("No commands to show.");
    }

      const categorized = commands.reduce((previous, current) => {
      const category = current.category || "Without category";
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
        if (!previous[category]["Without subcategory"]) {
          previous[category]["Without subcategory"] = [];
        }
        previous[category]["Without subcategory"].push(current);
      }

      return previous;
    }, {});

    let text = `I have *${commands.size}* commands to you:\n`;

    for (const [category, subcategories] of Object.entries(categorized)) {
      text += `\n> ------------------------\n`;
      text += `\n*${category}:*\n`;

      for (const [subcategory, commands] of Object.entries(subcategories)) {
        if (subcategory !== "Without subcategory") {
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
