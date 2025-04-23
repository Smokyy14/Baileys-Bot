module.exports = {
    name: "say",
    alias: [""], // If you want to add aliases, you must mark them as an array for the help command to work.
    category: "General",
    use: "/say < mensaje >",
    description: "Repeats your message.",
    
    async execute (sock, msg, args) {
        const message = args.join(" ");
        const jid = msg.messages[0].key.remoteJid
        
        sock.sendMessage(jid, { text: message })
    }
}
