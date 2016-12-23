const utils = require('../utils');

const link = 'https://discordapp.com/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&scope=bot&permissions=268509234';

exports.run = function (bot, msg) {
    msg.channel.sendMessage('', {
        embed: utils.embed('**Invite SwearBot to your server!**', `Click [here](${this.getLink(bot)}) to invite SwearBot to your server.`)
    });
};

exports.getLink = function (bot) {
    return link.replace('INSERT_CLIENT_ID_HERE', bot.user.id);
};

exports.info = {
    name: 'invite',
    usage: 'invite',
    description: 'Gives you an invite link for SwearBot'
};