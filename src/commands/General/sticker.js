const ffmpeg = require("fluent-ffmpeg");
const { downloadMediaMessage } = require("baileys");
const { unlink } = require("fs").promises;
const { resolve } = require("path");

module.exports = {
  name: "sticker",
  alias: ["s"],
  use: "-sticker [ photo | quoted photo ]",
  description: "Make stickers from videos or photos.",
  category: "General",

  execute: async (sock, msg) => {
    const quoted = msg?.messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const mediaMessage = quoted || msg.messages[0]?.message;
    const type = Object.keys(mediaMessage)[0];
    
    if (type !== "imageMessage" && type !== "videoMessage") {
      await sock.sendMessage(msg.messages[0]?.key.remoteJid, {
        text: "Please, quote a photo o video",
      });
      return;
    }

    const output = resolve("src", "temp", `${Date.now()}.webp`);

    try {
      await sock.sendMessage(msg.messages[0]?.key.remoteJid, {
        react: { text: "⏳", key: msg.messages[0]?.key },
      });
        
      const src = await downloadMediaMessage({ message: mediaMessage }, "stream");

      if (!src) return;

      if (type === "imageMessage") {
        await new Promise((resolve, reject) => {
          ffmpeg(src)
            .on("end", resolve)
            .on("error", reject)
            .addOutputOptions([
              "-vf",
              "scale='iw*min(300/iw,300/ih)':'ih*min(300/iw,300/ih)',format=rgba,pad=300:300:'(300-iw)/2':'(300-ih)/2':'#00000000',setsar=1",
              "-lossless", "1",
            ])
            .toFormat("webp")
            .save(output);
        });
      } else if (type === "videoMessage") {
        await new Promise((resolve, reject) => {
          ffmpeg(src)
            .on("end", resolve)
            .on("error", reject)
            .addOutputOptions([
              "-vcodec", "libwebp",
              "-vf",
              "scale='iw*min(300/iw,300/ih)':'ih*min(300/iw,300/ih)',format=rgba,pad=300:300:'(300-iw)/2':'(300-ih)/2':'#00000000',setsar=1,fps=10",
              "-loop", "0",
              "-ss", "00:00:00.0",
              "-t", "00:00:06.5",
              "-preset", "default",
              "-an", "-vsync", "0", "-s", "512:512",
            ])
            .toFormat("webp")
            .save(output);
        });
      }

      await sock.sendMessage(msg.messages[0]?.key.remoteJid, { sticker: { url: output }, });
      await sock.sendMessage(msg.messages[0]?.key.remoteJid, { react: { text: "✅", key: msg.messages[0]?.key }, });

    } catch (error) {
      console.error(error?.stack || error);
      await sock.sendMessage(msg.messages[0]?.key.remoteJid, { react: { text: "❌", key: msg.messages[0]?.key }, });
    } finally {
      try {
        await unlink(output);
      } catch (err) {
        console.error("Error trying to delete the sticker:", err);
      }
    }
  },
};
