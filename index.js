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

exports.read = reader;

exports.add = add;

exports.remove = remove;

exports.filesToDoc = filesToDoc;

exports.version = version;
