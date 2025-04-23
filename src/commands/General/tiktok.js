const axios = require("axios");

module.exports = {
    name: "tiktok",
    alias: ["ttdl", "tt"],
    category: "General",
    description: "Download videos from TikTok",
    use: "-tiktok <url>",

    async execute(sock, msg, args) {
        const url = args[0];
        const info = msg.messages[0];
        const from = info.key.remoteJid;

        if (!url) {
            return sock.sendMessage(
                from,
                {
                    text: "Please provide a TikTok link.\n> Usage: -tiktok < url >",
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
                        text: "Could not get video information, check the link.",
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
                        text: "Cannot download the video.",
                    },
                    { quoted: info }
                );
            }

            await sock.sendMessage(from, {
                react: { text: "✅", key: info?.key },
            });
        } catch (error) {
            console.error("Error downloading TikTok video:", error);
            await sock.sendMessage(
                from,
                {
                    text: "An error ocurred trying to download the video.",
                },
                { quoted: info }
            );
        }
    },
};
