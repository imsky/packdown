var fs = require('fs');
var path = require('path');

var walk = require('walk');
var promise = require('bluebird');
var diff = require('diff');

var packdown = require('../index');

var dirReader = function (root) {
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

var docFromDir = function (dir, options) {
  return promise.resolve(dirReader(dir))
    .then(function (files) {
      return {
        'files': files
      };
    });
};

describe('Packdown', function () {
  describe('writer', function () {
    it('creates simple file correctly', function () {
      var reference = fs.readFileSync('test/reference/simple/reference.md', {
        'encoding': 'utf8'
      });

      return docFromDir('test/files/simple')
        .then(function (doc) {
          var packdoc = packdown.write(doc);

          var difference = diff.diffLines(reference, packdoc);

          if (difference.length > 1) {
            console.log(difference);
            throw Error('Difference in output detected');
          }

          return packdoc;
        });
    });
  });
});