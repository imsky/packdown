var fs = require('fs');
var path = require('path');

var walk = require('walk');

/**
 * Recursively walks over directory and reads all contained files
 * Returns a flat array with a relative path from directory to file and a buffer of the file
 * @param baseDir Base directory
 * @param cb Node-style callback function
 */
module.exports = function (baseDir, cb) {
  var files = [];
  var cleanBaseDir = path.normalize(baseDir);
  var cleanBaseDirSplit = cleanBaseDir.split(path.sep);

  var walker = walk.walk(cleanBaseDir);

  walker.on('file', function (fileRoot, fileStats, next) {
    var filename = path.join(fileRoot, fileStats.name);
    var filenameSplit = filename.split(path.sep);

    for(var i = 0; i < cleanBaseDirSplit.length; i++) {
      filenameSplit.shift();
    }

    var relativeFilename = filenameSplit.join(path.sep);

    fs.readFile(filename, function (err, fileData) {
      files.push({
        'path': relativeFilename,
        'ext': path.extname(fileStats.name),
        'content': fileData
      });
      next();
    });
  });

  walker.on('errors', cb);

  walker.on('end', function () {
    cb(null, files);
  });
};