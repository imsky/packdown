var version = require('./lib/version');

var write = require('./lib/writer');
var read = require('./lib/reader');
var add = require('./lib/add');
var remove = require('./lib/remove');
var template =  require('./lib/template');
var filesToDoc = require('./lib/files-to-doc');

exports.write = write;

exports.read = read;

/**
 * Add a file object to a document object
 * @param {Object} document
 * @param {Object} file
 * @return A file already existing at the added path or null
 */
exports.add = function (document, file) {
  var oldFile = document.files[file.name] ? document.files[file.name] : null;

  document.files[file.name] = file;

  if (!oldFile) {
    document.content.push({
      'file': file.name
    });
  }

  return oldFile;
};

exports.remove = remove;

exports.filesToDoc = filesToDoc;

exports.template = template;

exports.version = version;
