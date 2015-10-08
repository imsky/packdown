var metadata = require('./packdown-metadata');

var writer = require('./lib/writer');
var reader = require('./lib/reader');

var versionInfo = function () {
  return {
    'packageVersion': metadata.packageVersion,
    'formatVersion': metadata.formatVersion
  };
};

exports.write = function (document) {
  return writer(document, versionInfo());
};

exports.read = function (document) {
  return reader(document);
};

exports.version = versionInfo();