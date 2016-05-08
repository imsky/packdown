var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('./utilities');

/**
 * Extract a Packdown document to directory
 * @param {String|Buffer} input - Filename (String) or source (Buffer)
 * @param {String} output - Output path
 * @param {Object} [variables] - Template variable map 
 * @return {Promise}
 */
module.exports = function ExtractCommand (input, output, variables) {
  return promise.resolve(true)
    .then(function normalizeInput () {
      if (Buffer.isBuffer(input)) {
        return input.toString('utf8');
      } else {
        return utilities.getFile(input);
      }
    })
    .then(function upsertDirectory (input) {
      output = output || 'unnamed';

      try {
        utilities.checkDir(output);
      } catch ( e ) {
        utilities.createDir(output);
      }

      return input.content || input;
    })
    .then(function conditionalTemplate (input) {
      if (variables) {
        var variablesFile = utilities.getFile(variables);
        var variablesObject = JSON.parse(variablesFile.content);
        return packdown.template(input, variablesObject);
      } else {
        return input;
      }
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
