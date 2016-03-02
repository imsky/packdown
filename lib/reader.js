var nearley = require('nearley');

var grammar = require('./grammar');

var FOUR_SPACES = require('./constants').FOUR_SPACES;

function isSpaceEncoded (line) {
  return line.slice(0, 4) === FOUR_SPACES;
}

module.exports = function (input) {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

  if (input.slice(-1) !== '\n') {
    input += '\n';
  }

  try {
    parser.feed(input);
  } catch (e) {
    throw Error('Failed to parse document');
  }

  var document = parser.results[0];

  document.files.forEach(function (file) {
    var spaceEncoding = false;
    var spaceEncodedLines = 0;
    var lastLineSpaceEncoded = false;

    //todo: allow disabling automatic space encoding detection
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