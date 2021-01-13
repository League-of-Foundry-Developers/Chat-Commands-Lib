import ChatCommand from "./ChatCommand.mjs";

export default class ChatCommands {

    constructor() {
        this.registeredCommands = [];
    }

    /**
     * Registers a Chat Command to be handled
     * @param command @typedef {Object} ChatCommand
     */
    registerCommand(command) {
        this.registeredCommands.push(command);
    }

    createCommand(commandKey, shouldDisplayToChat, invokeOnCommand, createdMessageType = 0) {
        return new ChatCommand(commandKey, shouldDisplayToChat, invokeOnCommand, createdMessageType);
    }

    handleChatMessage(chatlog, messageText, chatData) {
        var matchString = messageText.toLowerCase();
        let matchedCommands = [];

        for (var x = 0; x < this.registeredCommands.length; x++) {
            let registeredCommand = this.registeredCommands[x];
            var commandKey = registeredCommand.commandKey.toLowerCase();
            if (commandKey != "" && matchString.includes(commandKey)) {
                matchedCommands.push(registeredCommand);
            }
        }

        let shouldCancel = false;
        let shouldShowToChat = false;

        for (let x=0; x < matchedCommands.length; x++) {
            let command = matchedCommands[x];
            messageText = ChatCommands._removeCommand(messageText, command.commandKey);
            chatData.type = command.createdMessageType;
            shouldCancel = true;

            if (command.shouldDisplayToChat) {
                shouldShowToChat = true;
            }

            if (command.invokeOnCommand != undefined) {
                let modifiedText = command.invokeOnCommand(chatlog, messageText, chatData);
                if (modifiedText != undefined) {
                    messageText = modifiedText;
                }
            }
        }

        if (shouldShowToChat) {
            chatData.content = messageText;
            ChatMessage.create(chatData);
        }
        return !shouldCancel;
    }

    static _caseInsensitiveReplace(line, word, replaceWith) {
        var regex = new RegExp('(' + word + ')', 'gi');
        return line.replace(regex, replaceWith);
    }

    static _removeCommand(messageText, command) {
        messageText = ChatCommands._caseInsensitiveReplace(messageText, command, "");

        return messageText.trim();
    }
    
}
