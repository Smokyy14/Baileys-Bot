const { createInterface } = require("readline");
const { readdir } = require("fs/promises");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const pino = require("pino");
const dotenv = require("dotenv");
const { Collection } = require("@discordjs/collection");
const { makeWASocket, 
        useMultiFileAuthState, 
        Browsers } = require("baileys");

dotenv.config();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const configPath = path.join(__dirname, "..", "settings.json");
let settings;
try {
  settings = require(configPath);
} catch (err) {
  console.error("No se pudo cargar settings.json desde:", configPath);
  process.exit(1);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function connectToWhatsApp() {
  const question = (txt) => new Promise((resolve) => rl.question(txt, resolve));

  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket ({
    auth: state,
    // version: [2, 3000, 1015901307],
    logger: pino({ level: "silent" }),
    browser: Browsers.appropriate("chrome"),
  });

  sock.commands = new Collection();
  sock.config = require(path.join(__dirname, "..", "settings.json"));
  
  if (!sock.authState.creds.registered) {
    const number = await question(`Escribe tu número de WhatsApp: `);
    const formatNumber = number.replace(/[\s+\-()]/g, "");
    const code = await sock.requestPairingCode(formatNumber);
    console.log(`Tu código de conexión es: ${code}`);
  }

  const directory = await readdir(path.resolve("src", "handlers"));


  for (const file of directory) {
    require(`./handlers/${file}`)(sock); 
  }

  sock.ev.on("creds.update", saveCreds);
}

connectToWhatsApp();

module.exports = { connectToWhatsApp };

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);
process.on("uncaughtExceptionMonitor", console.error);
