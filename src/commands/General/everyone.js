module.exports = {
    name: "everyone",
    alias: ["all", "mentionall"],
    use: "/everyone [ message (optional) ]",
    description: "Tag all group members.",
    category: "General",
    admin: true,

    async execute(sock, msg, args) {
        const group = msg.messages[0].key.remoteJid; 
        const { remoteJid, participant } = msg.messages[0].key; 
		if ( remoteJid.endsWith("@g.us")) {
            return msg.reply("This command cannot be used in DM.")
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
            await sock.sendMessage(remoteJid, { text: "There was an error trying to mention all members." });
        }
    }
};
