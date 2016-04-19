var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('./utilities');

/**
 * Extract a Packdown document to directory
 * @param {Object} input - Input file (String or Buffer)
 * @param {String} output - Output path
 * @return {Promise}
 */
module.exports = function ExtractCommand (input, output) {
  return promise.resolve(true)
    .then(function normalizeInput () {
      if (Buffer.isBuffer(input)) {
        return input.toString('utf8');
      } else {
        return utilities.getFile(input);
      }
    })
    .then(function upsertDirectory (input) {
      output = output || (input.props ? input.props.name : 'unnamed');

      try {
        utilities.checkDir(output);
      } catch ( e ) {
        utilities.createDir(output);
      }

      return input.content || input;
    })
    .then(packdown.read)
    .then(function createFileArray (doc) {
      return Object.keys(doc.files).map(function fileArrayMapper (filename) {
        var file = doc.files[filename];
        var content = file.content.join('\n');

        return {
          //todo: dasherize name
          'name': file.name,
          'content': content
        };
      });
    })
    .then(function extractFiles (files) {
      var extracted = 0;

      files.forEach(function attemptFileExtraction (file) {
        utilities.putFile(path.join(output, file.name), file.content);
        extracted++;
      });

      return extracted;
    });
};
