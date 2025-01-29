const axios = require("axios");
const { resolve } = require("path");

module.exports = {
  name: "ssweb",
  category: "📷 Multimedia",
  subcategory: "Imagenes",
  use: "-ssweb <url>",
  description: "Genera una imagen a partir de una captura de una URL.",
  
  async execute(sock, msg, args) {
    const info = msg.messages[0];
    const jid = info.key.remoteJid;

    // Validar si se proporcionó una URL
    if (args.length < 1) {
      return msg.reply(`Por favor, ingresa la URL para generar la imagen.\nEjemplo: ${this.use}`);
    }

    const url = args.join(" ");

    // Verificar si la URL está vacía
    if (!url) {
      return msg.reply("Por favor, ingresa una URL válida.");
    }

    const output = resolve("src", "temp", `${Date.now()}.jpg`);

    try {
      await sock.sendMessage(jid, { react: { text: "⏳", key: msg.messages[0]?.key } });

      // Generar la URL de captura de pantalla del sitio web
      const apiUrl = `https://deliriussapi-oficial.vercel.app/screenshot?url=${encodeURIComponent(url)}`;
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      // Guardar la imagen como JPG
      await require("fs").promises.writeFile(output, buffer);

      // Enviar la imagen al usuario
      await sock.sendMessage(jid, { image: { url: output }, caption: "_*Aquí está la captura de pantalla solicitada!*_" });
      await sock.sendMessage(jid, { react: { text: "✅", key: msg.messages[0]?.key } });

    } catch (error) {
      console.error("Error al generar la imagen:", error.message);
      await sock.sendMessage(jid, { react: { text: "❌", key: msg.messages[0]?.key } });
      msg.reply("Hubo un error al generar la imagen. Verifica los datos ingresados.");
    }
  },
};
