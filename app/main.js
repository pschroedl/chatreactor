var irc = require('irc'),
    winston = require('winston'),
    createDispatcher = require('./dispatcher');

global.CHATREACTOR = require('./globals');

global.LOGGER = new (winston.Logger)({
  exitOnError: false,
  transports: [new (winston.transports.Console)()]
});

var dispatcher = createDispatcher(CHATREACTOR.CHANNEL, new irc.Client(CHATREACTOR.SERVER, CHATREACTOR.USERNAME, {
  channels: [CHATREACTOR.CHANNEL],
  realName: 'Hack Reactor IRC Bot',
  floodProtection: true,
  floodProtectionDelay: 750
}));

dispatcher.addListener('message', function (from, message) {
  dispatcher.dispatch('message', from, message);
}, '#hackreactor');

dispatcher.addListener('join', function (nick, message) {
  dispatcher.dispatch('join', nick, message);
}, '#hackreactor');

dispatcher.addListener('error', function (message) {
  LOGGER.log('error', 'IRC Error: %j', message);
});
