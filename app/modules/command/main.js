var _ = require('lodash'),
    Q = require('q'),
    winston = require('winston');

var isCommand = function(command) {
  return _.first(command) === this.commandPrefix;
};

var isValidOwner = function(nick) {
  var deferred = Q.defer();

  this.whois(nick, _.bind(function(res) {
    deferred.resolve(res && res.account && _.contains(this.owners, nick));
  }, this));

  return deferred.promise;
};

var handler = function() {
  _.extend(this, {
    isCommand: isCommand,
    isValidOwner: isValidOwner
  });

  this.registerHook('message#', function(nick, to, text, message) {
    winston.info('Activity on', to + ':', '<' + nick + '>', text);
  });

  this.registerHook('pm', function(nick, text, message) {
    this.isValidOwner(nick).then(_.bind(function(is) {
      if (is && this.isCommand(text)) {
        this.say(nick, 'Command received, master.');
      }
    }, this));
  });
};

module.exports = handler;
