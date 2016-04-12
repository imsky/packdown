var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('../utilities');

/**
 * Extract a Packdown document
 * @method extractCommand
 * @param {String} input - Path to input file
 * @param {String} output - Output path
 * @return {Promise}
 */
module.exports = function extractCommand (input, output) {
  return promise.resolve(true)
    .then(function () {
      if (Buffer.isBuffer(input)) {
        return input.toString('utf8');
      } else {
        return utilities.getFile(input);
      }
    })
    .then(function (input) {
      output = output || (input.props ? input.props.name : 'unnamed');

      try {
        utilities.checkDir(output);
      } catch ( e ) {
        utilities.createDir(output);
      }

      return input.content || input;
    })
    .then(packdown.read)
    .then(function (doc) {
      return Object.keys(doc.files).map(function (filename) {
        var file = doc.files[filename];
        var content = file.content.join('\n');

        return {
          'name': file.name,
          'content': content
        };
      });
    })
    .then(function (files) {
      var extracted = 0;

      files.forEach(function (file) {
        try {
          utilities.putFile(path.join(output, file.name), file.content);
          extracted++;
        } catch ( e ) {
          console.error('Error extracting ' + file.name);
        }
      });

      return extracted;
    });
};
