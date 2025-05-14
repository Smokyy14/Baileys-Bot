# Baileys-Bot

A foundational WhatsApp bot built with JavaScript, designed for the Baileys multi-device library.

## 📌 Overview

This repository contains the base structure for a modular and scalable WhatsApp bot using the [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) library.

It provides a clean and organized codebase where you can easily create commands, handle group events, customize behavior, and expand functionality.

If you're starting to build your own WhatsApp bot, this base will save you hours of setup time.

---

## 🔧 Features

- 📁 Modular command system
- ✅ Easy command usage and aliasing
- 🧱 Easy to build upon and maintain
- 📦 Uses Baileys for WhatsApp multi-device support

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Smokyy14/Baileys-Bot.git
cd Baileys-Bot
```

### 2. Install the dependences

```bash
npm install
```

### 3. Start the bot

```bash
npm run deploy
```

- This will prompt you with a numeral code. Introduce it using your WhatsApp account and the bot will be ready to use.

--- 

### Project structure

```bash
Base-Bot/
├── commands/          # All bot commands organized by category
│   ├── General/
│   └── ...            # Add your own folders or place commands here
├── lib/               # Helpers, database logic, sticker creation, etc.
├── auth/              # Auth credentials stored here
├── index.js           # Main entry point of the bot
├── package.json       # Project metadata and dependencies
└── README.md          # This file
```

---

### 🧩 Creating Commands

You can add commands simply by placing them in the commands/ folder.
Each command file should export an object like this:
```JavaScript
module.exports = {
  name: "ping",
  alias: ["latency"],
  category: "Info",
  description: "Check bot response time.",
  async execute(sock, msg, args) {
    const start = Date.now();
    await msg.reply("Pinging...");
    const end = Date.now();
    await msg.reply(`Pong! Response time: ${end - start}ms`);
  }
};
```
Commands are automatically loaded on startup, including their aliases.

---

### 🔐 Session Handling
The bot uses Baileys session management.

The numeral code will only appear on first use or when session data is invalid.

The session data is stored in the auth/ directory.

Make sure not to share this folder to avoid exposing authentication data.

---

### 🧪 Contributing
Want to improve this base?

Fork this repository
Create your feature branch: 
```bash
git checkout -b my-feature
```
Commit your changes: 
```bash
git commit -am 'Add new feature'
```
Push to the branch: 
```bash
git push origin my-feature1   
```
Open a Pull Request

---

### 📄 License
This project is licensed under the MIT License — feel free to use it for commercial or private projects.

---

📬 Contact me here!
- [Gmail](fdsmdfr985@gmail.com)
- [Twitter](https://x.com/StarsOnThaSky)

Want to talk or show your project? Open an issue or fork away!

---

### 💡 Tip
You can use this base to build powerful bots for:

Community management
WhatsApp games
Utility tools (downloading media, managing groups)
Stickers, memes, and more!
Made with ❤️ for developers who love building cool bots.

---
