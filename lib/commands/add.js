var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');

module.exports = function (file, document) {
  return promise.resolve(true)
    .then(function () {
      var basePath = path.normalize(file.path);
      var baseParts = basePath.split(path.sep);

      //remove any relative parts
      var cleanPath = baseParts.filter(function (chunk) {
        return !chunk.match(/^\.+$/);
      }).join(path.sep);

      var packdownDoc = packdown.read(document.content);

      if (!packdownDoc.files) {
        packdownDoc.files = [];
      }

      return [packdownDoc, packdown.add(packdownDoc, {
        'name': cleanPath,
        'content': file.content
      })];
    })
    .spread(function (document, addResult) {
      var status;

      if (addResult === null) {
        status = 'added';
      } else {
        status = 'replaced';
      }

      var output = packdown.write(document);

      return {
        'status': status,
        'output': output
      };
    });
};