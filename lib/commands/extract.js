var fs = require('fs');
var path = require('path');

var promise = require('bluebird');
var validPath = require('is-valid-path');
var shell = require('shelljs');

var packdown = require('../../index');

module.exports = function (input, output) {
  return promise.resolve(true)
    .then(function () {
      if (!validPath(output)) {
        throw Error('Invalid output path: ' + output);
      }

      if (Buffer.isBuffer(input)) {
        return input.toString('utf8');
      } else {
        var stat = fs.statSync(input);

        if (!stat.isFile() || stat.isDirectory()) {
          throw Error('Input is not a file');
        }

        return fs.readFileSync(input, 'utf8');
      }
    })
    .then(packdown.read)
    .then(function (doc) {
      if (!doc.files || !doc.files.length) {
        throw Error('No files in document');
      }

      shell.mkdir('-p', output);

      var extracted = [];
      doc.files.forEach(function (file) {
        var content = file.content.join('\n');
        try {
          fs.writeFileSync(path.join(output, file.name), content);
          extracted.push(file);
        } catch ( e ) {
          console.error('Error extracting file: ' + file.name);
        }
      });

      return extracted;
    });
};