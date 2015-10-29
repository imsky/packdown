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
  }, function (err, files) {
    if (err) {
      cb(err);
    } else {
      cb(null, files.map(function (file) {
        var stat = fs.statSync(file);

        if (!stat.isFile()) {
          return false;
        }

        var content = fs.readFileSync(file);

        return {
          'path': file,
          'ext': path.extname(file),
          'content': content
        };
      }).filter(Boolean));
    }
  });
};