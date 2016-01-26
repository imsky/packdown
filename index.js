var metadata = require('./packdown-metadata');

var writer = require('./lib/writer');
var reader = require('./lib/reader');
var add = require('./lib/add');
var remove = require('./lib/remove');

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

exports.add = function (document, file) {
  return add(document, file);
};

exports.remove = function (document, path) {
  return remove(document, path);
};

exports.version = versionInfo();