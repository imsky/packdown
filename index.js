var version = require('./lib/version');

var write = require('./lib/writer');
var read = require('./lib/reader');
var add = require('./lib/add');
var remove = require('./lib/remove');
var filesToDoc = require('./lib/files-to-doc');

exports.write = write;

exports.read = read;

exports.add = add;

exports.remove = remove;

exports.filesToDoc = filesToDoc;

exports.version = version;
