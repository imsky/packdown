var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('../utilities');

/**
 * Adds a file to a Packdown document
 * @method AddCommand
 * @param {String} file - Input file path
 * @param {String} document - Packdown document path
 * @return {Promise}
 */
module.exports = function AddCommand (file, document) {
  var fileObj = utilities.getFile(file);
  var documentObj = utilities.getFile(document);

  return promise.resolve(true)
    .then(function () {
      var basePath = path.normalize(fileObj.path);
      var baseParts = basePath.split(path.sep);

      //remove any relative parts
      var cleanPath = baseParts.filter(function (chunk) {
        return !chunk.match(/^\.+$/);
      }).join(path.sep);

      var packdownDoc = packdown.read(documentObj.content);

      return [packdownDoc, packdown.add(packdownDoc, {
        'name': cleanPath,
        'content': fileObj.content
      })];
    })
    .spread(function (packdownDoc, addResult) {
      var status;

      if (addResult === null) {
        status = 'added';
      } else {
        status = 'replaced';
      }

      var output = packdown.write(packdownDoc);

      utilities.putFile(document, output);

      return {
        'status': status,
        'output': output
      };
    });
};