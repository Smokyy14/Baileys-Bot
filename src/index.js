const whatsapp = require("@whiskeysockets/baileys");
const discord = require("@discordjs/collection");
const readl = require("readline");
const pino = require("pino");
const fs = require("fs");

process.loadEnvFile();

const rl = readl.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function connectToWA() {
    const { state, saveCreds } = await whatsapp.useMultiFileAuthState("auth");

    const browser = whatsapp.Browsers.appropriate("firefox");

    const sock = whatsapp.makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state,
        browser,
        version: [2, 3000, 1015901307], 
    })

    // Figura que el numero del bot permanezca siempre en linea. Puedes comentarla si prefieres mantener esto desactivado.
    sock.markOnlineOnConnect; 

    if (!sock.authState.creds.registered) {
        const input = (txt) => new Promise((resolve) => rl.question(txt, resolve));

        const phone = await input("Escribe tú número de WhatsApp: ");
        const number = phone.replace(/[\s+\-()]/g, "");
        const code = await sock.requestPairingCode(number);
        console.log(`Codigo ${code} en la tienda del Fortnite chicos`)
    }

    sock.commands = new discord.Collection();
    sock.components = new discord.Collection();

    const folder = await fs.promises.readdir("./src/handlers");
    for (const file of folder) {
        const handler = require(`./handlers/${file}`);
        if (typeof handler === "function") handler(sock);
    }

    sock.ev.on("creds.update", saveCreds);
    sock.config = require("../settings.json");
}

connectToWA();

module.exports = { connectToWA };