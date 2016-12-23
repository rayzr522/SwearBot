const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

const letterTransforms = {
    e: ['3'],
    i: ['1', '7'],
    a: ['8', '7', '@', '#'],
    o: ['0', '@'],
    l: ['1', '7']
};

const invisichars = [
    '\u200b',
    '\u200e',
    '\u202a'
].join('');

const config = bot.config = require('./config.json');
const whitelist = bot.whitelist = require('./whitelist.json');

var words = bot.words = transformWordList(require('./words.json'));
var commands = bot.commands = {};


bot.on('ready', () => {
    if (!bot.user) {
        console.log('Failed to log in! Make sure you set up the config file and that you have an internet connection.');
        return;
    }

    console.log(`Logged in as '${bot.user.username}'`);

    bot.user.setAvatar('./avatar.png');
    bot.user.setGame(`${config.prefix}help | Running on ${bot.guilds.size} servers`);

    fs.readdirSync('./src/commands/').forEach((file) => {
        if (file.startsWith('_') || !file.endsWith('.js')) return;
        let command = require(`./commands/${file}`);
        if (typeof command.run !== 'function' || typeof command.info !== 'object') {
            console.error(`(!) Invalid command file: '${file}'`);
            return;
        }
        commands[command.info.name] = command;
    });

    console.log(`Use the link below to invite SwearBot:\n> ${commands['invite'].getLink(bot)}`);
});

function transformWordList(words) {
    var newWords = {};
    for (const word in words) {
        newWords[word] = {
            regex: regexFromWord(word),
            replacement: words[word]
        };
    }
    return newWords;
}

function replaceAll(string, regex, replacement) {
    var start = string;
    var temp = start.replace(regex, replacement);
    var count = 0;
    while (count < 100 && start !== (temp)) {
        start = temp;
        temp = start.replace(regex, replacement);
        count++;
    }
    return start;
}

function applyLetterTransforms(word) {
    var newWord = '';
    word.split('').forEach(l => newWord += letterTransforms[l.toLowerCase()] ? `[${l.toUpperCase()}${l.toLowerCase()}${letterTransforms[l.toLowerCase()].join('')}]+` : (/[a-z]/.test(l) ? `[${l.toUpperCase()}${l.toLowerCase()}]+` : l));
    return newWord;
}

function regexFromWord(word) {
    return new RegExp(
        applyLetterTransforms(word.split('').join(`[ ${invisichars}$@#^*._-]*`))
    );
}

bot.on('message', (msg) => {
    if (msg.author.id === bot.user.id) return;

    if (msg.content.startsWith(config.prefix)) {
        // It's a command
        let content = msg.content.substr(config.prefix.length);
        let command = content.split(' ')[0];
        let args = content.split(' ').splice(1);
        if (commands[command]) {
            commands[command].run(bot, msg, args);
            return;
        }
    }

    var changed = false;

    var content = msg.content;

    whitelist.forEach(word => {
        content = replaceAll(content, word, '\u00a0' + word.split('').join('\u00a0') + '\u00a0');
    });

    for (const word in words) {
        var modified = replaceAll(content, words[word].regex, words[word].replacement);
        if (modified !== content) {
            content = modified;
            changed = true;
        }
    }

    if (!changed) {
        // No changes
        return;
    }

    msg.delete();
    msg.channel.sendMessage(`${msg.author.username}: ${content}`);

});

exports = bot;

bot.login(config.token);