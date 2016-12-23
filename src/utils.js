// Color-related constants
const rgbToHex = /rgb\((\s*\d{1,3}(\s*,\s*\d{1,3}){2}\s*)\)/;
const simpleColors = {
    'white': '#FFFFFF',
    'black': '#000000',
    'red': '#FF0000',
    'green': '#00FF00',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'pink': '#FF00FF',
    'cyan': '#00FFFF'
};

exports.blankLine = function () {
    return '```\n ```\n';
};

exports.randRange = function (start, finish) {
    return start + Math.round(Math.random() * (finish - start));
};

exports.isIpod = function (author) {
    return this.isUser(author, 'ipodtouch0218#0400');
};

exports.isUser = function (user, userString) {
    return user.username === userString.split('#')[0] && user.discriminator === userString.split('#')[1];
};

exports.embed = (title, description = '', fields = [], options = {}) => {

    let url = options.url || '';
    let timestamp = options.timestamp || false;
    let color = this.getColor(options.color || '#4EC9F9');

    // if (fields.length > 0) description += '\n' + fields.map(obj => `\n**${obj.name}**\n${obj.value}`).join('\n');
    if (options.inline) fields = fields.map(obj => { obj.inline = true; return obj; });
    if (fields.length > 0) fields.push({ name: '\u200b', value: '\u200b' });
    if (url !== '') description += '\n';
    return {
        color,
        title,
        fields,
        description: (description === '' ? null : `${description}`),
        url,
        video: { url },
        image: { url },
        timestamp: timestamp ? new Date() : null,
    };
};

exports.editRole = function (client, roleName, callback) {
    for (const guild of client.guilds) {
        for (const role of guild[1].roles) {
            if (role[1].name === roleName) {
                callback(role[1]);
            }
        }
    }
};

exports.hexToDec = function (hexInput) {
    if (typeof hexInput === 'number') return hexInput;
    if (typeof hexInput !== 'string') return 0;
    if (hexInput.startsWith('#')) hexInput = hexInput.substr(1);
    return parseInt(hexInput, 16);
};

exports.rgbToHex = function (rgb) {
    if (typeof rgb !== 'string') return '#000000';
    if (!rgbToHex.test(rgb)) return '#000000';
    return '#' + rgb.replace(rgbToHex, '$1').split(',')
        .map(num => parseInt(num.trim()).toString(16))
        .map(num => num.length < 2 ? '0'.repeat(2 - num.length) + num : num)
        .map(num => num.length > 2 ? 'FF' : num)
        .join('').toUpperCase();
};

exports.getColor = function (input) {
    if (typeof input !== 'string') return 0;
    if (rgbToHex.test(input)) input = this.rgbToHex(input); // This falls into the next if
    if (input.startsWith('#')) return this.hexToDec(input);
    if (typeof simpleColors[input.toLowerCase()] === 'string')
        return this.getColor(simpleColors[input.toLowerCase()]);
    return 0;
};