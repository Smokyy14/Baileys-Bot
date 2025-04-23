module.exports = {
  name: "help",
  alias: ["h", "hcomm"],
  category: "General",
  use: "/help [ command ]",
  description: "Shows detailed info about a command.",
  
  async execute(sock, msg, args) {
    const info = msg.messages ? msg.messages[0] : null;
    const remoteJid = info?.key?.remoteJid;

    const commandName = args[0];

    if (!commandName) {
      return sock.sendMessage(
        remoteJid,
        { text: "Please, enter a command to provide the information.\nExample: `/help menu`" },
        { quoted: info }
      );
    }

    const visibleCommands = sock.commands.filter(({ dev }) => !dev );
    const command = visibleCommands.find(
      (cmd) => cmd.name === commandName || (cmd.alias && cmd.alias.includes(commandName))
    );

    if (!command) {
      return sock.sendMessage(
        remoteJid,
        { text: `_The command \`${commandName}\` doesn't exist or you are not able to see it._\n_Please verify the name._` },
        { quoted: info }
      );
    }

    const { name, alias, use, description } = command;
    let responseText = `*Command help:* \`${name || "Not assigned"}\`\n\n`;
        responseText += `*Usage:* ${use || "Not assigned"}\n\n`;
      if (alias && alias.length > 0) {
        responseText += `*Alias:* ${alias.join(", ")}\n\n`; // This is why the "alias" field must exist as an array, even though it only has one alias.
    } else {
        responseText += `*Alias:* Not assigned\n\n`;
    }
        responseText += `*Description:* ${description || "Not assigned"}\n\n`;

    sock.sendMessage(remoteJid, { text: responseText }, { quoted: info });
  },
};
