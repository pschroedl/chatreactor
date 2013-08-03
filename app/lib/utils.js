var slice = Array.prototype.slice;

var utils = {};

utils.reversePartial = function(func) {
  var outerArgs = slice.call(arguments, 1);
  return function() {
    var innerArgs = slice.call(arguments);
    return func.apply(this, innerArgs.concat(outerArgs));
  };
};

module.exports = utils;
