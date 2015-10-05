var writer = require('./lib/writer');
var reader = require('./lib/reader');

var packageVersion = '0.0.0';
var formatVersion = 1;

exports.options = function () {
  return {
    'packageVersion': packageVersion,
    'formatVersion': formatVersion
  };
};

exports.write = function (document) {
  var options = exports.options();
  return writer(document, options);
};

exports.read = function (document) {
  return reader(document);
};