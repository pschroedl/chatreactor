var _ = require('lodash'),
    fs = require('fs'),
    path = require('path');

var MODULESPATH = path.join(__dirname, '..', 'modules'),
    MODULENAME = 'main.js';

var modules = Object.create(null);

_.chain(fs.readdirSync(MODULESPATH)).map(function(listing) {
  return path.join(MODULESPATH, listing);
}).filter(function(listing) {
  return fs.lstatSync(listing).isDirectory();
}).each(function(dir) {
  if (!_.contains(fs.readdirSync(dir), MODULENAME)) {
    return;
  }

  modules[path.basename(dir)] = require(path.join(dir, MODULENAME));
});

module.exports = modules;
