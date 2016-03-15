var promise = require('bluebird');

var packdown = require('../../index');

/*
@param input An object with a root property (root directory) and a files property (array of files with at least a path and a content property)
*/
module.exports = function (input) {
  return promise.resolve(true)
    .then(function () {
      return packdown.filesToDoc(input.root, input.files);
    })
    .then(packdown.write);
};
