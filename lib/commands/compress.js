var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('../utilities');

/**
 * Compresses a directory to a Packdown file
 * @param {String} input - Input directory
 * @param {} output - Output Packdown file
 * @return {Promise}
 */
module.exports = function CompressCommand (input, output) {
  return promise.resolve(true)
    .then(function getDirectory () {
      return utilities.getDir(input);
    })
    .then(function convertFilesToDoc (res) {
      return packdown.filesToDoc(res.root, res.files);
    })
    .then(packdown.write)
    .then(function putFiles (res) {
      if (output) {
        return [res, utilities.putFile(output, res)];
      }

      return [res];
    })
    .spread(function compressResult (res) {
      return res;
    });
};
