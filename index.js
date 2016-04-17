var version = require('./lib/version');

var write = require('./lib/writer');
var read = require('./lib/reader');
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

/**
 * Remove a file at specified path from a Packdown document
 * @param {} document
 * @param {} path
 * @return The deleted file, if any, or null
 */
exports.remove = function (document, path) {
  var oldFile = document.files[path] ? document.files[path] : null;

  if (oldFile) {
    delete document.files[path];

    if (Array.isArray(document.content)) {
      document.content = document.content.filter(function (chunk) {
        return typeof chunk === 'string' || chunk.file !== path;
      });
    }
  }

  return oldFile;
};

exports.filesToDoc = filesToDoc;

exports.template = template;

exports.version = version;
