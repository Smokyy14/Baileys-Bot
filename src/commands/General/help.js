module.exports = {
  name: "help",
  alias: ["h", "hcomm"],
  category: "Comandos",
  use: "/help [comando]",
  description: "Muestra la información detallada de un comando específico.",
  
  async execute(sock, msg, args) {
    const info = msg.messages ? msg.messages[0] : null;
    const remoteJid = info?.key?.remoteJid;

    const commandName = args[0];

    if (!commandName) {
      return sock.sendMessage(
        remoteJid,
        { text: "Por favor, especifica el comando para ver su ayuda.\nEjemplo: `-help menu`" },
        { quoted: info }
      );
    }

    // Filtra los comandos con el campo "dev"
    const visibleCommands = sock.commands.filter(({ dev }) => !dev );
    const command = visibleCommands.find(
      (cmd) => cmd.name === commandName || (cmd.alias && cmd.alias.includes(commandName))
    );

    if (!command) {
      return sock.sendMessage(
        remoteJid,
        { text: `_El comando \`${commandName}\` no existe o no puedes verlo._\n_Por favor, verifica el nombre._` },
        { quoted: info }
      );
    }

    const { name, alias, use, description } = command;
    let responseText = `*Ayuda para el comando:* \`${name || "No asignado"}\`\n\n`;
        responseText += `*Uso:* ${use || "No asignado"}\n\n`;
    if (alias && alias.length > 0) {
        responseText += `*Alias:* ${alias.join(", ")}\n\n`; // Esta es la razón por la cual el campo "alias" debe existir como un array, a pesar de que tenga un solo alias.
  } else {
        responseText += `*Alias:* No asignado\n\n`;
  }
        responseText += `*Descripción:* ${description || "No asignada"}\n\n`;

    sock.sendMessage(remoteJid, { text: responseText }, { quoted: info });
  },
};
