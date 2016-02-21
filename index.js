var version = require('./lib/version');

var writer = require('./lib/writer');
var reader = require('./lib/reader');
var add = require('./lib/add');
var remove = require('./lib/remove');
var filesToDoc = require('./lib/files-to-doc');

exports.write = function (document) {
  //todo: validate document object
  return writer(document);
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

exports.filesToDoc = function (files) {
  return filesToDoc(files);
};

exports.version = version;
