var promise = require('bluebird');

var packdown = require('../../index');

module.exports = function (input) {
  return promise.resolve(true)
    .then(function () {
      if (Buffer.isBuffer(input)) {
        return input.toString('utf8');
      } else {
        return input;
      }
    })
    .then(packdown.read)
    .then(function (doc) {
      return doc.files.map(function (file) {
        var content = Array.isArray(file.content) ? file.content.join('\n') : file.content;

        return {
          'name': file.name,
          'content': content
        };
      });
    });
};