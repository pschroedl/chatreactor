var _ = require('lodash'),
    async = require('async'),
    irc = require('irc'),
    winston = require('winston'),
    modules = require('./lib/loadModules');

var generateHandlers = function(hooks) {
  hooks = hooks || [];
  if (!_.isArray(hooks) && _.isString(hooks)) {
    hooks = [hooks];
  }

  var handlers = {};

  _.each(hooks, function(hook) {
    // TODO: Validate hook name
    handlers[hook] = [];
  });

  return handlers;
};

var Bot = function(config) {
  if (!config) {
    throw new TypeError('Cannot create a bot without a configuration');
  }

  var bot = Object.create(Bot.prototype, {
    _config: { value: config },
    commandPrefix: { value: config.commandPrefix },
    owners: { value: _.isArray(config.owners) ? config.owners : [config.owners] },
    handlers: { value: generateHandlers(config.hooks) },
    modules: { value: config.modules }
  });

  // Jumpstart the bot; this inits its connection to IRC
  Bot.prototype.constructor.call(bot, config.server, config.nick, config);

  // Register all modules defined in this bot's config.json
  bot.loadModules();

  // Register all of the hooks, binding `this` to reference the bot itself
  _.each(bot.handlers, function(handlers, name) {
    // Whenever a given event occurs, fire all handlers in parallel
    bot.on(name, function() {
      var args = arguments;
      async.each(handlers, _.bind(function(handler) {
        handler.apply(this, args);
      }, this));
    });
  }, bot);

  return bot;
};

Bot.prototype = Object.create(irc.Client.prototype);

Bot.prototype.loadModules = function() {
  winston.info('Registering modules on bot', this._config.userName + '...');

  _.each(this._config.modules, function(module) {
    winston.info('Registering', module, 'module on chatbot', this._config.userName);
    _.has(modules, module) && modules[module].call(this);
  }, this);

  winston.info('Modules registered for chatbot', this._config.userName);
};

Bot.prototype.registerHook = function(type, func) {
  this.handlers[type] && this.handlers[type].push(func);
};

module.exports = Bot;
