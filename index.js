var write = require('./lib/writer');
var parser = require('./lib/parser');
var filesToDoc = require('./lib/files-to-doc');

var templayed = require('./vendor/templayed');
var version = require('./packdown-version');

var FOUR_SPACES = '    ';

/**
 * @param {String} line
 * @return Boolean
 */
function isSpaceEncoded (line) {
  return line.slice(0, 4) === FOUR_SPACES;
}

/**
 * Read text as a Packdown document
 * @param {String} input
 * @param {Object} options - {disableSpaceEncoding}
 * @return Document object
 */
exports.read = function PackdownReader (input, options) {
  options = options || {};

  if (input.slice(-1) !== '\n') {
    input += '\n';
  }

  var document = parser(input);

  Object.keys(document.files).forEach(function (fileName) {
    var file = document.files[fileName];
    var spaceEncoding = false;
    var spaceEncodedLines = 0;
    var lastLineSpaceEncoded = false;

    if (options.disableSpaceEncoding) {
      return document;
    }

    if (file.content.length > 1) {
      // if two consecutive lines (ignoring empty lines) are space encoded, then the file is treated as space encoded
      for (var i = 0; i < file.content.length; i++) {
        if (!file.content[i].length) {
          continue;
        }

        lastLineSpaceEncoded = isSpaceEncoded(file.content[i]);

        if (lastLineSpaceEncoded) {
          spaceEncodedLines++;
          if (spaceEncodedLines > 1) {
            spaceEncoding = true;
            break;
          }
        } else {
          if (i === 0 || lastLineSpaceEncoded) {
            spaceEncoding = false;
            break;
          }
        }
      }
    } else if (file.content.length === 1 && isSpaceEncoded(file.content[0])) {
      spaceEncoding = true;
    }

    if (spaceEncoding) {
      file.content = file.content.map(function (line) {
        return line.replace(/^ {4}/, '');
      });
    }
  });

  return document;
};

exports.write = write;

exports.filesToDoc = filesToDoc;

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

/**
 * Render a Mustache template
 * @param {String} template - The template to render
 * @param {Object} variables - The values used within template
 * @return String
 */
exports.template = function (template, variables) {
  return templayed(template)(variables);
};

exports.version = {
  'package': version.package,
  'format': version.format
};
