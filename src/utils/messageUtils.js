module.exports = async (sock, msg) => {
  msg.reply = async (...args) => {
    let options = {};

    if (args.length === 1 && typeof args[0] === "string") {
      options = { text: args[0] };
    } else if (args.length === 1 && typeof args[0] === "object") {
      options = args[0];
    } else if (args.length > 1) {
      options = { ...args };
    }

    return await sock.sendMessage(msg.messages[0].key.remoteJid, options, {
      quoted: msg.messages[0],
    });
  };

  msg.react = (reaction = "") => {
    return sock.sendMessage(msg.messages[0].key.remoteJid, {
      react: { text: reaction, key: msg.messages[0].key },
    });
  };
};
