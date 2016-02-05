var fs = require('fs');
var path = require('path');

var promise = require('bluebird');
var recursive = require('recursive-readdir');
var validPath = require('is-valid-path');

var packdown = require('../../index');

var precursive = promise.promisify(recursive);

module.exports = function (input, output) {
  var stat = fs.statSync(input);

  if (input === '.' || input === './') {
    input = process.cwd();
  }

  if (!stat.isFile() && stat.isDirectory()) {
    return precursive(input)
      .then(function (files) {
        return files.map(function (file) {
          return {
            'path': file,
            'ext': path.extname(file),
            'content': fs.readFileSync(file, 'utf8')
          };
        });
      })
      .then(packdown.filesToDoc)
      .then(packdown.write)
      .then(function (doc) {
        if (typeof output === 'undefined') {
          console.log(doc);
          return doc;
        } else {
          assert(validPath(output), 'Invalid output path: ' + output);
          fs.writeFileSync(output, doc);
        }
      });
  } else {
    throw Error('Not a directory: ' + input);
  }
};
