module.exports = {
    name: "call",

    async load(call, sock) {
        const { id, from } = call[0];
        await sock.rejectCall(id, from);
    }
};

