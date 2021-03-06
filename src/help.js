var log = require("npmlog");
var v = require('./globalVariables');
var helpBoolean = 0;
var i = 0;

var index = ['saveText', 'translate', 'quickNotifications', 'notifyMention', 'remind', 'quote', 'chatColour', 'chatTitle', 'nickname', 'echo', 'endlessTalk', 'mcgill'];
var numbers = {};

var title = {
    echo: 'Using echo',
    endlessTalk: 'Direct responses',
    saveText: 'Saving text',
    chatColour: 'Chat colours',
    quickNotifications: 'Quick notifications',
    notifyMention: 'Mention notifications',
    userTimeout: 'User timeout',
    remind: 'Reminders',
    nickname: 'Chat nicknames',
    chatTitle: 'Chat title',
    translate: 'Translate',
    quote: 'Quote/Find/Count',
    mcgill: 'McGill Features'
};

var info = {};

function listener(api, message, input) {
    v.section = 'help listener';
    if (input.length < 8 && v.contains(input, 'help')) menu(api, message);
}

function menu(api, message) {
    v.section = 'help menu';
    v.continue = false;
    i = 0;
    numbers = {};
    var sTitle = 'Please type the number corresponding to what you wish to know about.\n\n0.   Complete instructions';
    for (var c = 0; c < index.length; c++) {
        if (v.b[index[c]]) {
            i++;
            numbers[i] = index[c];
            sTitle += '\n' + i + '. ';
            if (i < 10) sTitle += '  ';
            sTitle += title[index[c]];
        }
    }

    helpBoolean = message.senderID;
    api.sendMessage(sTitle, message.threadID);
    var atbot = '"@' + v.botNameL;
    info = {
        echo: atbot + ' --echo [text]" will have ' + v.botName + ' repeat that text verbatim.',

        endlessTalk: atbot + ' --me" will get ' + v.botName + ' to automatically respond to you, without you having to type ' + atbot +
            '" in the future (you still need @' + v.botNameL + ' for commands). You can type "stop" to disable this afterwards.',

        saveText: atbot +
            ' --save xxx" will save the input xxx with a timestamp. These saved messages are specific to each conversation,' +
            ' and are not related to other messages you save in other messages.\n' +
            atbot + ' --saved" will show the saved input.\n' + atbot + ' --erase" will erase the saved input.',

        chatColour: atbot +
            ' #000000" will change the chat colour to 000000 (black). That colour can be any 6 digit hex colour.' +
            '\nCommon colour names may also be recognized, and you can create your own suggestions.\n#random will set the colour to a random colour and\n#undo will change it to the previous colour.',

        quickNotifications: 'You need to type ' + atbot + ' --eqn" to enable this feature.\n' + atbot +
            ' @[name]: [content]" will notify [name] once he/she responds to ensure that the message is viewed.\n' + atbot +
            ' --dqn" will disable this feature.',

        notifyMention: atbot + ' --notify" will notify you when anyone else from any other thread mentions your name.\n' + atbot +
            ' --notify [key]" will do the same, but with [key] as the keyword. You may add multiple keys.\n' + atbot +
            ' --notify --clear" will clear all the keys, and\n' + atbot + ' --notify --keys will show you all your current keys\n' + atbot + ' --notify ![key]" will blacklist [key] from the search (' + atbot +
            ' --notify !bot" will not notify you if a message contains "bot")',

        remind: atbot + ' remind [name] @[time] [content]" will create a reminder for [name] in the future.' +
            '\n[time] can be formatted by HH:mm (with or without am/pm) or by a full date(YYYY/MM/DD HH:mm)',

        nickname: atbot + ' nickname: [nickname]" will change your nickname to [nickname]; leave it blank (nickname: ) to remove your nickname',

        chatTitle: atbot + ' title: [title]" will change the conversation title',

        translate: atbot +
            ' -t [language] [text]" will translate [text]. [language] may either be the language you are translating to, or [input]:[output] (ie @' +
            v.botNameL + '-t french:russian bonjour)\n' + atbot + ' -t" will display all the available languages',

        quote: atbot + ' --find [text]" will display the latest message containing [text].\n' + atbot +
            ' --quote [text]" will do the same thing but will also save it \nYou may view the saved quotes via ' + atbot +
            ' --quotes" or ' + atbot + ' --all quotes" to see the quotes saved by everyone in this conversation.\n' + atbot +
            ' --count" will display the number of messages in the conversation',

        mcgill: '"@mcgill [course]" will display some information on that course (ie @mcgill biol200)'
    };

    if (v.devMode) {
        info.nickname = info.nickname + '\n* Dev features\n' + atbot +
            ' --nonickname" will remove all nicknames and save them to firebase\
        \n' + atbot +
            ' --yesnickname" will restore the nicknames if they were saved';
    }
}

function specific(api, message) {
    v.section = 'help specific';
    if (helpBoolean != message.senderID) return;
    helpBoolean = 0;
    v.continue = false;
    var num = parseInt(message.body);
    if (isNaN(num)) return;
    if (num > index.length) return;
    var full = '';
    if (num == 0) {
        full = v.botName + ' is a Facebook Chat Bot that can be called by using "@' + v.botNameL +
            ' [message]"\n\nIt also has the following features:';
        for (var c = 1; c <= i; c++) {
            full += '\n\n--- ' + title[numbers[c]] + ' ---\n' + info[numbers[c]];
        }
    } else {
        full = '--- ' + title[numbers[num]] + ' ---\n\n' + info[numbers[num]];
    }
    api.sendMessage(full, message.threadID);
}

module.exports = {
    listener: listener,
    menu: menu,
    specific: specific
}
