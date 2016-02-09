var fs = require('fs');
var path = require('path');
var assert = require('assert');

var promise = require('bluebird');
var recursive = require('recursive-readdir');
var validPath = require('is-valid-path');

var packdown = require('../../index');

var precursive = promise.promisify(recursive);

module.exports = function (input, output) {
  if (input === '.' || input === './') {
    input = process.cwd();
  }

  return promise.resolve(true)
    .then(function () {
      var stat = fs.statSync(input)
      return !stat.isFile() && stat.isDirectory()
    })
    .then(function (isDirectory) {
      if (!isDirectory) {
        throw Error('Not a directory: ' + input);
      }

      return precursive(input);
    })
    .then(function (files) {
      var basePath = path.normalize(input);

      return files.map(function (file) {
        //todo: remove if files start with leading slash
        var filePath = path.normalize(file).slice(basePath.length + 1);

        return {
          'path': filePath,
          'ext': path.extname(file),
          'content': fs.readFileSync(file, 'utf8')
        };
      });
    })
    .then(packdown.filesToDoc)
    .then(packdown.write)
    .then(function (doc) {
      if (typeof output === 'undefined') {
        return doc;
      } else {
        assert(validPath(output), 'Invalid output path: ' + output);
        fs.writeFileSync(output, doc);
      }
    });
};
