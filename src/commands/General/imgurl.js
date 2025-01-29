const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const axios = require("axios");
const { FormData, Blob } = require('formdata-node');

module.exports = {
  name: "imgurl",
  alias: ["tourl"],
  category: "Comandos",
  description: "Sube una imagen a imgbb y devuelve una URL.",
  use: "/tourl",
  isutilidades: true,

  execute: async (sock, msg, args) => {
    const info = msg.messages[0];
    const from = info.key.remoteJid;

    try {
      await sock.sendMessage(from, { react: { text: "⏳", key: info.key } });
      const citado = msg?.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage ? msg?.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage : info?.message;
      const messageType = Object.keys(citado)[0];

    if (messageType !== "imageMessage") {
      await sock.sendMessage(from, { react: { text: "❔️", key: info.key } });
      await  sock.sendMessage(info.key.remoteJid, { text: "Adjunta o cita una imagen." });
      return;
    }
      await sock.sendPresenceUpdate('composing', from) 

      const stream = await downloadContentFromMessage(citado[messageType], 'image');
      const buffer = Buffer.concat(await streamToArray(stream));

      const blob = new Blob([buffer], { type: 'image/png' });
      const formData = new FormData();
            formData.append("image", blob, "image.png");

      const params = { key: "308dd9e0f85152952b3b9b90d0598ef0" };

      const { data } = await axios.post("https://api.imgbb.com/1/upload", formData, {
        params,
        headers: formData.getHeaders ? formData.getHeaders() : { 'Content-Type': 'multipart/form-data' }
      });

      await sock.sendMessage(from, { react: { text: "✅", key: info.key } });
      await sock.sendMessage(from, { text: `${data.data.url}` }, 
                                   { quoted: info, });
      await sock.sendPresenceUpdate('available', from) 

    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { react: { text: "❌", key: info.key } });
      await sock.sendMessage(from, {
        text: error.message
      }, {
        quoted: info,
      });
    }
  }
};

async function streamToArray(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
}