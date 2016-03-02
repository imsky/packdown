var fs = require('fs');
var path = require('path');

var promise = require('bluebird');

var packdown = require('../../index');

module.exports = function (file, document) {
  return promise.resolve(true)
    .then(function () {
      var fileStat = fs.statSync(file);
      var documentStat = fs.statSync(document);

      if (!fileStat.isFile()) {
        throw Error('File is not a file');
      }

      if (!documentStat.isFile()) {
        throw Error('Document is not a file');
      }

      return [
        file,
        fs.readFileSync(file, 'utf8'),
        fs.readFileSync(document, 'utf8')
      ];
    })
    .spread(function (filePath, fileContent, documentContent) {
      var basePath = path.normalize(filePath);
      var baseParts = basePath.split(path.sep);

      //remove any relative parts
      var cleanPath = baseParts.filter(function (chunk) {
        return !chunk.match(/^\.+$/);
      }).join(path.sep);

      var document = packdown.read(documentContent);

      if (!document.files) {
        document.files = [];
      }

      return [document, packdown.add(document, {
        'name': cleanPath,
        'content': fileContent
      })];
    })
    .spread(function (document, addResult) {
      var message;

      if (addResult === null) {
        message = 'new file added';
      } else {
        message = 'file replaced';
      }

      return packdown.write(document);
    })
};