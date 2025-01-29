const axios = require("axios");

module.exports = {
    name: "tiktok",
    alias: ["ttdl", "tt"],
    category: "Comandos",
    description: "Descarga videos o imágenes de TikTok.",
    use: "-tiktok <url>",

    async execute(sock, msg, args) {
        const url = args[0];
        const info = msg.messages[0];
        const from = info.key.remoteJid;

        if (!url) {
            return sock.sendMessage(
                from,
                {
                    text: "Por favor, proporciona un enlace de TikTok.\n> Uso: -tiktok <url>",
                },
                { quoted: info }
            );
        }

        await sock.sendMessage(from, {
            react: { text: "📥", key: info?.key },
        });

        try {
            const response = await axios.get(
                `https://api.agatz.xyz/api/tiktok?url=${url}`
            );
            const data = response.data.data;

            if (!data || !data.status) {
                return sock.sendMessage(
                    from,
                    {
                        text: "No se pudo obtener información del video. Verifica el enlace.",
                    },
                    { quoted: info }
                );
            }

            const videoUrl = data.data.find((item) => item.type === "nowatermark_hd")?.url ||
                data.data.find((item) => item.type === "nowatermark")?.url ||
                data.data.find((item) => item.type === "watermark")?.url;

            if (videoUrl) {
                await sock.sendMessage(
                    from,
                    {
                        video: { url: videoUrl },
                    },
                    { quoted: info }
                );
            } else {
                return sock.sendMessage(
                    from,
                    {
                        text: "No se pudo descargar el video.",
                    },
                    { quoted: info }
                );
            }

            await sock.sendMessage(from, {
                react: { text: "✅", key: info?.key },
            });
        } catch (error) {
            console.error("Error al descargar el contenido de TikTok:", error);
            await sock.sendMessage(
                from,
                {
                    text: "Hubo un error al procesar tu solicitud. Intenta nuevamente.",
                },
                { quoted: info }
            );
        }
    },
};
