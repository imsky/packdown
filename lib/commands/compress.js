var promise = require('bluebird');

var packdown = require('../../index');
var utilities = require('../utilities');

module.exports = function (input, output) {
  return promise.resolve(true)
    .then(function () {
      return utilities.getDir(input);
    })
    .then(function (res) {
      return packdown.filesToDoc(res.root, res.files);
    })
    .then(packdown.write)
    .then(function (res) {
      if (output) {
        return [res, utilities.putFile(output, res)];
      }

      return [res];
    })
    .spread(function (res) {
      return res;
    });
};
