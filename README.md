![](https://img.shields.io/badge/Foundry-v0.7.9-informational)
<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
<!--- ![Latest Release Download Count](https://img.shields.io/github/downloads/<user>/<repo>/latest/module.zip) -->

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
<!--- ![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2F<your-module-name>&colorB=4aa94a) -->

# FoundryVTT Library: Chat Commands

Allows for easy registration of custom chat commands such as /command.

The library will handle multiple commands in a single string - if any are marked `shouldDisplayToChat`, then a single chat message is created with all commands stripped.

## Include as a dependency in your manifest

```json
{
    "name": "_chatcommands",
    "type": "module",
    "manifest": "https://github.com/League-of-Foundry-Developers/Chat-Commands-Lib/releases/download/beta1-1.0.0/module.json"
}
```

# Chat Command class

## commandKey

Type: `string`
The chat command, such as "/command"

## shouldDisplayToChat

Type: `boolean`

If true, the command will be removed from the message and the message displayed to chat, such as "/command hi" -> "hi"
If false, no message will be displayed

## invokeOnCommand

Type: `function`

The function to invoke when the command is matched

Example Function:

```js
function onCommandInvoke(chatlog, messageText, chatData) => {
    console.log("Invoked Command");
});
```

## createdMessageType

Type: `integer`
Default: `0` (Other)

When `shouldDisplayToChat` is true, the type of message that should be created


# Example Usage

```js
Hooks.on("chatCommandsReady", function(chatCommands) {
  // This Command will display the text after the command as well as invoke the method
  let command = chatCommands.createCommand("/displaytochat", true, (chatlog, messageText, chatdata) => {
    console.log("Invoked /displaytochat");
    console.log(messageText);
  });
  chatCommands.registerCommand(command);

  // This will eat the command, displaying nothing to chat, as well as invoke the method
  let command2 = chatCommands.createCommand("/dontdisplaytochat", false, (chatlog, messageText, chatdata) => {
    console.log("Invoked /dontdisplaytochat");
    console.log(messageText);
  });
  chatCommands.registerCommand(command2);

  // This uses the optional createdMessageType option to make the created message "Out of Character"
  let command3 = chatCommands.createCommand("/outofcharacter", true, (chatlog, messageText, chatdata) => {
    console.log("Invoked /outofcharacter");
    console.log(messageText);
  }, 1);
  chatCommands.registerCommand(command3);

  // This modifies the text that will end up in the created message
  let command4 = chatCommands.createCommand("/toupper", true, (chatlog, messageText, chatdata) => {
    console.log("Invoked /toupper");
    messageText = messageText.toUpperCase();
    console.log(messageText);
    return messageText;
  });
  chatCommands.registerCommand(command4);
});
```

## Changelog

### v1.0.0

Initial release
