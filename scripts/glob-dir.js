var fs = require('fs');
var path = require('path');

var glob = require('glob');

/**
 * Globs a pattern and returns a flat array of files
 * @param pattern Glob pattern
 * @param cb Node-style callback function
 */
module.exports = function (pattern, cb) {
  glob(pattern, {
    'dot': true,
    'silent': true,
    'nocase': true
  }, cb);
};