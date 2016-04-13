var parser = require('./parser').line;

var FOUR_SPACES = require('./constants').FOUR_SPACES;

/**
 * @method isSpaceEncoded
 * @param {String} line
 * @return Boolean
 */
function isSpaceEncoded (line) {
  return line.slice(0, 4) === FOUR_SPACES;
}

/**
 * Read text as a Packdown document
 * @method PackdownReader
 * @param {String} input
 * @param {Object} options - {disableSpaceEncoding}
 * @return Document object
 */
module.exports = function PackdownReader (input, options) {
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
        return line.replace(/^    /, '');
      });
    }
  });

  return document;
};