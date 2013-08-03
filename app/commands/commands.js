var _ = require('lodash'),
    moment = require('moment');

var commands = {};

commands.echo = function(message) {
  return [
    'SENDER:', message.from,
    '. Your arguments were: [', message.args.join(', '), ']'
  ].join(' ');
};

commands.commands = function() {
  var list = _.chain(commands)
             .keys()
             .map(function(key) { return key.toUpperCase(); })
             .value()
             .join(', ');

  return [
    'Command prefix is', CHATREACTOR.COMMANDPREFIX, '||',
    'Current list of commands:', list
  ].join(' ');
};

commands.date = function() {
  return 'The date is: ' + moment().format('MMMM Do YYYY').toString();
};

commands.time = function() {
  return 'The time is: ' + moment().format('h:mm:ss a').toString();
};

commands.help = function() {
  return [
    'Welcome to the Hack Reactor IRC channel.',
    'To highlight a user, type their name and hit `ENTER`.'
  ];
};

module.exports = commands;
