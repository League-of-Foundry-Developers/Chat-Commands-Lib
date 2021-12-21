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

    /**
     * Deregister a Chat Command
     * @param command @typedef {Object} ChatCommand
     */
    deregisterCommand(command) {
        ChatCommands._removeFromArray(this.registeredCommands, command);
    }

    static _removeFromArray(array, element) {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    /**
     * @deprecated in favor of createCommandFromData(data)
     */
    createCommand(commandKey, shouldDisplayToChat, invokeOnCommand, createdMessageType = 0) {
        return new ChatCommand(commandKey, shouldDisplayToChat, invokeOnCommand, createdMessageType, "fa-terminal", "No description provided");
    }

    createCommandFromData(data) {
        return new ChatCommand(
            data.commandKey, 
            this._getOrDefault(data.shouldDisplayToChat, false), 
            data.invokeOnCommand,
            this._getOrDefault(data.createdMessageType, 0),
            this._getOrDefault(data.iconClass, "fa-terminal"),
            this._getOrDefault(data.description, "No description provided"),
            this._getOrDefault(data.gmOnly, false)
        );
    }

    _getOrDefault(value, defaultValue) {
        if (value != undefined) {
            return value;
        }
        return defaultValue
    }

    handleChatMessage(chatlog, messageText, chatData) {
        var matchString = messageText.toLowerCase();
        let matchedCommands = [];

        for (var x = 0; x < this.registeredCommands.length; x++) {
            let registeredCommand = this.registeredCommands[x];
            var commandKey = registeredCommand.commandKey.toLowerCase();
            if (commandKey != "" && matchString.startsWith(commandKey)) {
                if (registeredCommand.gmOnly && !game.user.isGM) continue;
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
