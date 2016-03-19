var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('../utilities');

module.exports = function (file, document) {
  var documentObj = utilities.getFile(document);

  return promise.resolve(true)
    .then(function () {
      var packdownDoc = packdown.read(documentObj.content);

      return [packdownDoc, packdown.remove(packdownDoc, file)];
    })
    .spread(function (packdownDoc, removeResult) {
      var status;

      if (removeResult === null) {
        status = 'not found';
      } else {
        status = 'removed';
      }

      var output = packdown.write(packdownDoc);

      utilities.putFile(document, output);

      return {
        'status': status,
        'output': output
      };
    });
};
