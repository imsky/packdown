var writer = require('./lib/writer');
var reader = require('./lib/reader');

exports.write = function (document) {
  var packageVersion = '0.0.0';
  var formatVersion = 1;

  var options = {
    'packageVersion': packageVersion,
    'formatVersion': formatVersion
  };

  return writer(document, options);
};

exports.read = function (document) {
  return reader(document);
};