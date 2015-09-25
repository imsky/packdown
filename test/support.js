var fs = require('fs');
var path = require('path');

var promise = require('bluebird');
var walk = require('walk');

var dirReader = exports.dirReader = function (root) {
  var walker = walk.walk(root);
  var files = [];

  return new promise(function (resolve, reject) {
    walker.on('file', function (_root, stats, next) {
      fs.readFile(path.join(_root, stats.name), function (err, data) {
        files.push({
          'path': path.join(_root.replace(root, ''), stats.name),
          'content': new Buffer(data).toString('utf8')
        });
        next();
      });
    });

    walker.on('nodeError', reject)
    walker.on('errors', reject)
    walker.on('end', resolve);
  })
    .then(function () {
      return files;
    });
};

var docFromDir = exports.docFromDir = function (dir, options) {
  return promise.resolve(dirReader(dir))
    .then(function (files) {
      return {
        'files': files
      };
    });
};