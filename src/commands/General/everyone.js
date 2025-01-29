module.exports = {
    name: "everyone",
    alias: ["all", "mentionall"],
    use: "/everyone [mensaje]",
    description: "Etiqueta a todo el grupo.",
    category: "Comandos",
	admin: true,

    async execute(sock, msg, args) {
        const group = msg.messages[0].key.remoteJid; 
        const { remoteJid, participant } = msg.messages[0].key; 
		if ( remoteJid.endsWith("@g.us")) {
            return msg.reply("Este comando no puede ser usado en chats privados.")
        }
        try {
            const groupMetadata = await sock.groupMetadata(remoteJid); 
            const members = groupMetadata.participants; 
            const grupoAdmins = members
                .filter((member) => member.admin === "admin" || member.admin === "superadmin")
                .map((admin) => admin.id);

            const mentions = members.map((member) => member.id);

            const message = args.length > 0 ? args.join(" ") : "@everyone";

            await sock.sendMessage(remoteJid, {
                text: `${message}`,
                mentions: mentions,
            });
        } catch (error) {
            console.error("Error en el comando everyone: ", error);
            await sock.sendMessage(remoteJid, { text: "Hubo un error al intentar mencionar a todos." });
        }
    }
};
