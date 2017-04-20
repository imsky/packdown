var FOUR_SPACES = '    ';

/**
 * @private
 * @param {String} line
 * @return Boolean
 */
function isSpaceEncoded (line) {
  return line.slice(0, 4) === FOUR_SPACES;
}

/**
 * Parse text into Packdown document
 * @param {String} input
 * @return Document object
 */
function parser (input) {
  var rFileHeading = /^\#{1,6} \/([a-z0-9\.\,\_\-\(\)\/]+)$/i;
  var rCodeHeading = /^```([a-z0-9][\-a-z0-9]*)$/i;
  var rCodeEnd = /^```$/;

  var document = {
    'files': {},
    'content': []
  };

  var text = String(input);
  var lines = text.split('\n');
  var line = lines[0];

  var stack = [];
  var file = null;

  for (var i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    file = null;

    var fileHeading = line.match(rFileHeading);
    var codeHeading = line.match(rCodeHeading);
    var codeEnd = line.match(rCodeEnd);
    var codeTag = codeHeading && codeHeading[1];

    if (fileHeading) {
      if (!stack.length) {
        file = {
          'name': fileHeading[1],
          'info': [],
          'content': [],
          'pending': true
        };
        document.files[file.name] = file;
        stack.push(file.name);
      } else {
        throw Error('File not finished parsing');
      }
    } else if (stack.length && (codeHeading || codeEnd)) {
      file = document.files[stack[0]];

      if (stack.length === 1) {
        file.tag = codeTag;
        stack.push(codeTag || 'txt');
      } else if (stack.length === 2 && !codeTag && file.pending) {
        delete file.pending;
        document.content.push({
          'file': file.name
        });
        stack = [];
      } else {
        throw Error('Invalid code block');
      }
    } else {
      if (stack.length === 1) {
        document.files[stack[0]].info.push(line);
      } else if (stack.length === 2) {
        document.files[stack[0]].content.push(line);
      } else {
        document.content.push(line);
      }
    }
  }

  if (stack.length) {
    throw Error('Invalid document');
  }

  return document;
}


/**
 * Generate document object from text input.
 * @param {String} input
 * @param {Object} options - {disableSpaceEncoding}
 * @example
 * var input = ['# /foo', '\`\`\`', 'content', '\`\`\`'].join('\n');
 * var output = packdown.read(input);
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

    //todo: move space decoding to parser
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

/**
 * Generate a Packdown file text block given a Packdown file object.
 * @private
 * @param {File} file
 * @return String
 */
function FileBlock (file) {
  var ret = [];

  var name = file.name;
  var info = file.info || '';
  var tag = file.tag || '';
  var content = file.content || '';
  var encoding = file.encoding || 'space';

  if (!name) {
    throw Error('File name is missing');
  }

  if (name.match(/\s/)) {
    throw Error('File name contains spaces');
  }

  var FileHeader = '### /' + name;

  ret.push(FileHeader);

  if (info) {
    ret.push(info);
  }

  var CodeBlockStart = '```' + tag;

  var encodedContent = content;

  if (typeof encodedContent === 'string') {
    encodedContent = content.split('\n');
  } else if (!Array.isArray(encodedContent)) {
    throw Error('File content is neither an array nor a string');
  }

  switch (encoding) {
    case 'space':
      encodedContent = encodedContent.map(function (line) {
        return FOUR_SPACES + line;
      })
        .join('\n');
      break;
  }

  ret.push(CodeBlockStart, encodedContent, '```');

  return ret.join('\n') + '\n';
}

/**
 * Generate Packdown document from document object.
 * @param {Object} document object
 * @example
 * var document = {
 *   'files': {
 *     'foo': {
 *       'name': 'foo',
 *       'content': 'bar'
 *     }
 *   },
 *   'content': [{
 *     'file': 'foo'
 *   }]
 * };
 * var output = packdown.write(document);
 * @return String
 */
exports.write = function Writer (document) {
  var content = document.content;
  var files = document.files;

  if (!content && !files) {
    throw Error('Document is missing content and files');
  }

  if ((!content || !content.length) && files && Object(files) === files && Object.keys(files).length) {
    content = Object.keys(files).map(function (file) {
      return {
        'file': file
      };
    });
  }

  if (!Array.isArray(content)) {
    throw Error('Invalid content provided');
  }

  if (Array.isArray(files)) {
    throw Error('Files should be a map');
  }

  return content.map(function (line) {
    if (line.file) {
      return FileBlock(files[line.file]);
    } else {
      return line;
    }
  }).join('\n');
};

exports.version = 'PACKDOWN_VERSION';
