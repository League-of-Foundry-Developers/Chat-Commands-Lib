import Autocomplete from "./Autocomplete.mjs";
import ChatCommands from "./ChatCommands.mjs";

Hooks.once('ready', function() {
    let chatCommands = new ChatCommands();
    window.game.chatCommands = chatCommands;

    Hooks.on("chatMessage", (chatlog, messageText, chatData) => {
        return chatCommands.handleChatMessage(chatlog, messageText, chatData);
    });

    game.settings.register("_chatcommands", "autocomplete", {
        name: "Should commands be autocompleted?",
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });

    game.settings.register("_chatcommands", "includeCoreCommands", {
        name: "Should core commands be included in autocomplete?",
        scope: 'client',
        config: true,
        type: Boolean,
        default: true
    });


    Hooks.callAll("chatCommandsReady", chatCommands);
});


Hooks.on('renderSidebarTab', (app, html, data) => {
    if (app.tabName !== "chat") {
        return;
    }
    let autocomplete = new Autocomplete();
    autocomplete.handleRenderSidebarTab(app, html, data);
});
