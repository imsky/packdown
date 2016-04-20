var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('./utilities');

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
    .then(function filterOutBinaryFiles (res) {
      res.files = res.files.filter(function binaryFilter (file) {
        return utilities.isBinaryFile(file.path) === false;
      });

      return res;
    })
    .then(function dasherizeFileNames (res) {
      //todo: dasherize all path components
      var filenameMap = res.files.reduce(function createFilenameMap (map, file) {
        map[file.path] = true;
        return map;
      }, {});

      res.files = res.files.map(function dasherize (file) {
        var newPath = utilities.dasherize(file.path);

        if (file.path !== newPath && filenameMap[newPath]) {
          throw Error('Automatically converted path conflicts with existing path: ' + newPath);
        }

        file.path = newPath;
        return file;
      });

      return res;
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
