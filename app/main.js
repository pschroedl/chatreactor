var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    winston = require('winston'),
    Bot = require('./bot');

winston.cli();

var bots, configs,
    configPath = path.join(__dirname, 'config');

configs = _.filter(fs.readdirSync(configPath), function(filename) {
  return (/\.json$/i).test(filename);
});

bots = _.chain(configs).map(function(filename) {
  var config = require(path.join(configPath, filename));

  winston.info('Creating bot with username', config.userName);

  return new Bot(config);
}).compact().value();
