var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');

module.exports = function (file, document) {
  return promise.resolve(true)
    .then(function () {
      var packdownDoc = packdown.read(document.content);

      return [packdownDoc, packdown.remove(packdownDoc, file)];
    })
    .spread(function (document) {
      var status;

      if (addResult === null) {
        status = 'not found';
      } else {
        status = 'removed';
      }

      var output = packdown.write(document);

      return {
        'status': status,
        'output': output
      };
    });
};