const fs = require("fs");
const path = require("path");
const { getGroupAdmins } = require("../utils/getAdmins.js");
const { jidNormalizedUser } = require("baileys");

module.exports = {
  name: "messages.upsert",

  async load(msg, sock) {
    if (msg.type !== "notify") return;
    const { message: ctx, key } = msg.messages[0];
    require("../utils/messageUtils")(sock, msg);

    const btn = ctx?.templateButtonReplyMessage || ctx?.buttonsResponseMessage;
    if (btn && typeof btn === "object") {
      const selected = btn?.selectedId || btn?.selectedButtonId;
      const [id, ...args] = selected.split("+");

      const component = sock.components.get(id);
      if (!component) return;

      return component.execute(sock, msg, args);
    }

    const chatId = key.remoteJid;
    const senderId = key.participant || key.remoteJid;

    msg.from = chatId;
    msg.sender = senderId;
    msg.isGroup = chatId.endsWith("@g.us");
    msg.isOwner = ["yourNumber@s.whatsapp.net"].includes(senderId);
    const jidToCheck = msg.isGroup ? jidNormalizedUser(msg.sender) : key.remoteJid;
  
    const body =
      ctx?.extendedTextMessage?.text ||
      ctx?.ephemeralMessage?.message?.extendedTextMessage?.text ||
      ctx?.conversation ||
      ctx?.imageMessage?.caption ||
      ctx?.videoMessage?.caption;

    if (!body || !["!"].some((prefix) => body.startsWith(prefix)) || body.length <= 1) return;

    const args = body.slice(1).trim().split(" ");
    const label = args.shift().toLowerCase();

    const command = sock.commands.find(
      ({ name, alias }) => name === label || alias?.includes(label)
    );

    if (!command) {
      return msg.reply(`El comando ${label} no existe.\nRevisa la lista de comandos con:\n-menu.`);
    }

    let isGroupAdmin = false;
    let isBotAdmin = false;

    if (msg.isGroup) {
      const groupMetadata = await sock.groupMetadata(chatId);
      const groupParticipants = groupMetadata.participants || [];
      const groupAdmins = getGroupAdmins(groupParticipants);

      isGroupAdmin = groupAdmins.includes(jidNormalizedUser(senderId));
      isBotAdmin = groupAdmins.includes(jidNormalizedUser(sock.user.lid));
    }

    if (command?.premium && !isPremium) return msg.reply("Este comando es exclusivo para usuarios premium.");
    if (command?.group && !msg.isGroup) return msg.reply("Este comando solo se puede utilizar en grupos.");
    if (command?.priv && msg.isGroup) return msg.reply("Este comando solo se puede utilizar en privado.");
    if (command?.admin && msg.isGroup && !isGroupAdmin && !msg.isOwner) return msg.reply("Este comando es solo para administradores.");
    if (command?.botadmin && msg.isGroup && !isBotAdmin) return msg.reply("El bot necesita ser administrador para ejecutar este comando.");

    try {
      await command.execute(sock, msg, args);} catch (error) {
      msg.reply("Ocurrió un error al ejecutar el comando.").then(() => {
        console.error(error);
      });
    }
  },
};
