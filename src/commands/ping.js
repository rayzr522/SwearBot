exports.run = function (bot, msg) {
    msg.channel.sendMessage('Ping!').then(m => {
        m.edit(`Ping! \`${m.createdTimestamp - msg.createdTimestamp}ms\``);
    });
};

exports.info = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings SwearBot'
};