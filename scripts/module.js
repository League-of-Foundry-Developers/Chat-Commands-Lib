import ChatCommands from "./ChatCommands.mjs";

Hooks.once('ready', function() {
    let chatCommands = new ChatCommands();
    Hooks.on("chatMessage", (chatlog, messageText, chatData) => {
        return chatCommands.handleChatMessage(chatlog, messageText, chatData);
    });
    Hooks.callAll("chatCommandsReady", chatCommands);
});
