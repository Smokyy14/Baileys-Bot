const { downloadContentFromMessage } = require("baileys");
const axios = require("axios");
const { FormData, Blob } = require('formdata-node');

async function streamToArray(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return chunks;
}

module.exports = {
  name: "imgurl",
  alias: ["tourl"],
  category: "General",
  description: "Upload a photo to img.bb and return the link",
  use: "/imgurl",
  isutilidades: true,

  execute: async (sock, msg, args) => {
    const info = msg.messages[0];
    const from = info.key.remoteJid;

    try {
      await sock.sendMessage(from, { react: { text: "⏳", key: info.key } });
      const quoted = msg?.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage ? msg?.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage : info?.message;
      const messageType = Object.keys(quoted)[0];

    if (messageType !== "imageMessage") {
      await sock.sendMessage(from, { react: { text: "❔️", key: info.key } });
      await  sock.sendMessage(info.key.remoteJid, { text: "Adjunta o cita una imagen." });
      return;
    }
      await sock.sendPresenceUpdate('composing', from) 

      const stream = await downloadContentFromMessage(quoted[messageType], 'image');
      const buffer = Buffer.concat(await streamToArray(stream));

      const blob = new Blob([buffer], { type: 'image/png' });
      const formData = new FormData();
            formData.append("image", blob, "image.png");

      const params = { key: "Your API Token here" };

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
