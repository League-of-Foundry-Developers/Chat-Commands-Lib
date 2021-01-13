export default class ChatCommand {
    constructor(commandKey, shouldDisplayToChat, invokeOnCommand, createdMessageType = 0) {
        this.commandKey = commandKey;
        this.shouldDisplayToChat = shouldDisplayToChat;
        this.invokeOnCommand = invokeOnCommand;
        this.createdMessageType = createdMessageType;
    }

  // /**
  //  * The chat command, such as /command
  //  * @type {string}
  //  */
  // get commandKey() {
  //   return this.commandKey;
  // }

  // set commandKey(key) {
  //   this.commandKey = key;
  // }

  // /**
  //  * If true, the command will be removed from the message and the message displayed to chat, such as "/command hi" -> "hi"
  //  * If false, no message will be displayed
  //  * @type {boolean}
  //  */
  // get shouldDisplayToChat() {
  //   return this.shouldDisplayToChat;
  // }

  // set shouldDisplayToChat(shouldDisplayToChat) {
  //   this.shouldDisplayToChat = shouldDisplayToChat;
  // }

  // /**
  //  * The function to invoke when the command is matched
  //  * @type {function}
  //  */
  // get invokeOnCommand() {
  //   return this.invokeOnCommand;
  // }

  // set invokeOnCommand(invokeOnCommand) {
  //   this.invokeOnCommand = invokeOnCommand;
  // }
}
