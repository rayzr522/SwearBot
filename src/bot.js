const Discord = require('discord.js');
const bot = new Discord.Client();

const config = bot.config = require('./config.json');
var commands = bot.commands = {};

bot.on('ready', () => {
    if (!bot.user) {
        console.log('Failed to log in! Make sure you set up the config file and that you have an internet connection.');
        return;
    }

    console.log(`Logged in as '${bot.user.username}'`);

    bot.user.setAvatar('./avatar.png');
    bot.user.setGame(`${config.prefix}help | Running on ${bot.guilds.size} servers`);
});

bot.on('message', (msg) => {
    if (msg.author.id === bot.user.id) return;

    if (msg.content.startsWith(config.prefix)) {
        // It's a command
        let content = msg.content.substr(config.prefix.length);
        let command = content.split(' ')[0];
        let args = content.split(' ').splice(1);
        if (commands[command]) {
            command.run(bot, msg, args);
            return;
        }
    }

    // TODO: Filter the !#%*ing swear words
});

exports = bot;

bot.login(config.token);