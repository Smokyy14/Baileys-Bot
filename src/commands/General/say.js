module.exports = {
	name: "say",
 // alias: [""], Si quieres añadir alias, debes marcarlos como un array para el funcionamiento del comando help.
    category: "Comandos",
    use: "/say < mensaje >",
    description: "Repite tu mensaje.",
    
    async execute (sock, msg, args) {
        const message = args.join(" ");
        const jid = msg.messages[0].key.remoteJid
        
        sock.sendMessage(jid, { text: message })
    }
}