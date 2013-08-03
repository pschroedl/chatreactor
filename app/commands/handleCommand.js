var _ = require('lodash'),
    commands = require('./commands');

var commandExists = _.partial(_.has, commands);

var getCommand = function(command) {
  return commandExists(command) ? commands[command] : null;
};

var parseMessage = function(incoming, from) {
  var args = incoming.slice(1).match(/([^\s]+)/g);

  return {
    command: getCommand(args[0].toLowerCase()),
    meta: {
      from: from,
      args: _.rest(args)
    }
  };
};

var handleCommand = function(from, incoming) {
  var cmd = parseMessage(incoming, from);

  switch (typeof cmd.command) {
    case 'function':
    return cmd.command.call(null, cmd.meta);
    break;

    case 'string':
    return cmd.command;
    break;

    default:
    return null;
    break;
  }
};

module.exports = handleCommand;
