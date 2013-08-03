var _ = require('lodash'),
    handleCommand = require('./commands/handleCommand');

_.str = require('underscore.string');

var isCommand = function(command) {
  return _.first(command) === CHATREACTOR.COMMANDPREFIX;
};

var getMessageType = function(incoming) {
  if (isCommand(incoming)) {
    return 'command';
  }

  return 'message';
};

var handleMessage = function(from, incoming) {
  var outgoing;

  switch (getMessageType(incoming)) {
    case 'command':
    outgoing = handleCommand(from, incoming);
    break;

    default:
    break;
  }

  return outgoing;
};

var sendMessage = function(client, channel, message) {
  if (!client || !channel) {
    return undefined;
  }

  if (_.isString(message)) {
    return client.say(channel, message);
  }

  if (_.isArray(message)) {
    return _.each(message, function(text) {
      client.say(channel, text);
    });
  }
};

var greet = function(nick) {
  // Prevent greeting self on join. (Show a little restraint, ChatReactor.)
  if (nick === CHATREACTOR.USERNAME) {
    return null;
  }

  return [
    'Welcome to #hackreactor,',
    (nick || 'anonymous user.')
  ].join(' ');
};

var dispatcher = Object.create(null);

dispatcher.dispatch = function(type, from, message) {
  var outgoing;

  switch(type) {
    case 'message':
    outgoing = handleMessage(from, message);
    break;

    case 'join':
    outgoing = greet(from, message);
    break;

    default:
    break;
  }

  outgoing && sendMessage(this._client, this._channel, outgoing);
};

dispatcher.addListener = function(type, callback, target) {
  this._client.addListener(_.str.join('', type, target), callback);
};

var createDispatcher = function(channel, client) {
  return Object.create(dispatcher, {
    _channel: { value: channel, enumerable: false, writable: false },
    _client: { value: client, enumerable: false, writable: false }
  });
};

module.exports = createDispatcher;
