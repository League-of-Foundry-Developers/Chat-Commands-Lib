// Based on https://github.com/orcnog/autocomplete-whisper/blob/master/scripts/autocomplete-whisper.js
export default class Autocomplete {

    handleRenderSidebarTab(app, html, data) {
        /* Set up markup for our UI to be injected */
        const $whisperMenuContainer = $('<div id="command-menu"></div>');
        const $ghostTextarea = $('<textarea class="chatghosttextarea" autocomplete="off" readonly disabled></textarea>');
        let $whisperMenu = $('<nav id="context-menu" class="expand-up"><ol class="context-items"></ol></nav>');

        let regex = new RegExp("\/[A-z]*");

        /* Add our UI to the DOM */
        $("#chat-message").before($whisperMenuContainer);
        $("#chat-message").after($ghostTextarea);

        /* Unbind original FVTT chat textarea keydown handler and implemnt our own to catch up/down keys first */
        $("#chat-message").off("keydown");
        $("#chat-message").on("keydown.menufocus", jumpToMenuHandler);
        /* Listen for chat input. Do stuff.*/
        $("#chat-message").on("input.whisperer", handleChatInput);
        /* Listen for "]" to close an array of targets (names) */
        $("#chat-message").on("keydown.closearray", listFinishHandler);
        /* Listen for up/down arrow presses to navigate exposed menu */
        $("#command-menu").on("keydown.menufocus", menuNavigationHandler);
        /* Listen for click on a menu item */
        $("#command-menu").on("click", "li", menuItemSelectionHandler);

        function handleChatInput() {

            if (!game.settings.get("_chatcommands", "autocomplete")) return;

            resetGhostText();
            const val = $("#chat-message").val();
            //console.log(val);
            if (val.match(regex)) {
    
                // It's a commands! Show a menu of commands and typeahead text if possible
                // let splt = val.split(regex);
                // console.log(splt);

                let input = val;


                let allCommands = [];
                allCommands = allCommands.concat(window.game.chatCommands.registeredCommands);

                if (game.settings.get("_chatcommands", "includeCoreCommands")) {
                    allCommands = allCommands.concat(_getCoreCommands());
                }

                let matchingCommands = allCommands.filter((target) => {
                    const p = target.commandKey.toUpperCase();
                    const i = val.toUpperCase();
                    return p.indexOf(i) >= 0 && p !== i;
                });

                //console.log(matchingCommands);

                if (matchingCommands.length > 0) {
    
                    // At least one potential target exists.
                    // show ghost text to autocomplete if there's a match starting with the characters already typed
                    ghostText(input, matchingCommands);
                    // set up and display the menu of whisperable names
                    let listOfPlayers = "";
                    for (let p in matchingCommands) {
                        if (isNaN(p)) continue;
                        let command = matchingCommands[p];
                        const name = command.commandKey;
                        let nameHtml = name;
                        let startIndex = name.toUpperCase().indexOf(input.toUpperCase());
                        if (input && startIndex > -1) {
                            nameHtml = name.substr(0, startIndex) + "<strong>" + name.substr(startIndex, input.length) + "</strong>" + name.substr(startIndex + input.length);
                        }
                        listOfPlayers += `<li class="context-item" data-name="${name}" tabIndex="0"><i class="fas ${command.iconClass} fa-fw" style="padding-right: 5px;"></i>${nameHtml} - ${command.description}</li>`;
                    }
                    $whisperMenu.find("ol").html(listOfPlayers);
                    $("#command-menu").html($whisperMenu);
    
                    // set up click-outside listener to close menu
                    $(window).on("click.outsidewhispermenu", (e) => {
                        var $target = $(e.target);
                        if (!$target.closest("#command-menu").length) {
                            closeWhisperMenu();
                        }
                    });
                } else {
                    closeWhisperMenu();
                }
            } else {
                closeWhisperMenu();
            }
        }

        function _getCoreCommands() {
            let commands = [];

            let chatCommands = window.game.chatCommands;

            commands.push(chatCommands.createCommandFromData({
                commandKey: "/ic",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Speak in character"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/ooc",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Speak out of character"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/emote",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Emote in character"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/whisper",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Send a whisper to another player"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/w",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Send a whisper to another player"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/roll",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Roll dice"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/gmroll",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Roll dice that only the GM can see"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/blindroll",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Roll dice that are hidden"
              }));
            
              commands.push(chatCommands.createCommandFromData({
                commandKey: "/selfroll",
                invokeOnCommand: (chatlog, messageText, chatdata) => {
                },
                shouldDisplayToChat: false,
                iconClass: "fa-dice-d20",
                description: "Roll dice that only you can see"
              }));

            return commands;
        }
    
        function listFinishHandler(e) {
            if (e.which == 221) { // `]`
                let val = $("#chat-message").val();
                if (val.match(listOfNamesRegex)) {
                    if (typeof e === "object") e.preventDefault();
                    val = val.trim();
                    const newval = val.substring(val.length - 1) === "," ? val.substring(0, val.length - 1) : val; // remove `,` from the end
                    $("#chat-message").val(newval + "] ");
                    closeWhisperMenu();
                }
            }
        }
    
        function jumpToMenuHandler(e) {
            if ($("#command-menu").find("li").length) {
                if (e.which === 38) { // `up`
                    $("#command-menu li:last-child").focus();
                    return false;
                } else if (e.which === 40) { // `down`
                    $("#command-menu li:first-child").focus();
                    return false;
                }
            }
            // if player menu is not visible/DNE, execute FVTT's original keydown handler
            ui.chat._onChatKeyDown(e);
        }
    
        function menuNavigationHandler(e) {
            if ($(e.target).is("li.context-item")) {
                if (e.which === 38) { // `up`
                    if ($(e.target).is(":first-child")) {
                        $("#chat-message").focus();
                    } else {
                        $(e.target).prev().focus();
                    }
                    return false;
                } else if (e.which === 40) { // `down`
                    if ($(e.target).is(":last-child")) {
                        $("#chat-message").focus();
                    } else {
                        $(e.target).next().focus();
                    }
                    return false;
                } else if (e.which === 13) { // `enter`
                    menuItemSelectionHandler(e);
                    return false;
                }
            }
        }
    
        function menuItemSelectionHandler(e) {
            e.stopPropagation();
            var autocompleteText = autocomplete($(e.target).text());
            $("#chat-message").val(autocompleteText.ghost);
            $("#chat-message").focus();
            closeWhisperMenu();
            if ($("#chat-message").val().indexOf("[") > -1) {
                handleChatInput();
            }
        }
    
        function ghostText(input, matches) {
            // show ghost text to autocomplete if there's a match starting with the characters already typed
            let filteredMatches = matches.filter((target) => {
                const p = target.commandKey.toUpperCase();
                const i = input.toUpperCase();
                return p.indexOf(i) === 0 && p !== i;
            });
            if (filteredMatches.length === 1) {
                var autocompleteText = autocomplete(filteredMatches[0].commandKey);
                $(".chatghosttextarea").val(autocompleteText.ghost);
                $(".chatghosttextarea").addClass("show");
                $("#chat-message").on("keydown.ghosttab", (e) => {
                    if (e.which == 9) { // tab
                        e.preventDefault();
                        $("#chat-message").val(autocompleteText.ghost);
                        resetGhostText();
                        $("#chat-message").focus();
                        closeWhisperMenu();
                        if ($("#chat-message").val().indexOf("[") > -1) {
                            handleChatInput();
                        }
                    }
                });
            } else {
                resetGhostText();
            }
        }
    
        function autocomplete(match) {
            if (!match) return;

            const typedCharacters = $("#chat-message").val();
            let nameToAdd = '';
            if (match.toUpperCase().indexOf(typedCharacters.toUpperCase()) === 0) {
                var restOfTheName = match.substr(typedCharacters.length);
                nameToAdd = typedCharacters + restOfTheName;
            } else {
                nameToAdd = match;
            }

            if (nameToAdd.includes(" - ")) {
                nameToAdd = nameToAdd.substr(0, nameToAdd.indexOf(" - "));
            }

            const ghostString = nameToAdd;
            
            return ({
                ghost: ghostString
            });
        }
    
        function closeWhisperMenu() {
            $("#command-menu").empty();
            $(window).off("click.outsidewhispermenu");
            resetGhostText();
        }
    
        function resetGhostText() {
            $("#chat-message").off("keydown.ghosttab");
            $(".chatghosttextarea").val("").removeClass("show");
        }
    }
}
