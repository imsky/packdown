var parser = require('./lib/parser');

var templayed = require('./vendor/templayed');

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

/**
 * Render a Mustache template.
 * @param {String} template - The template to render
 * @param {Object} variables - The values used within template
 * @example
 * var template = '{{foo}}';
 * var variables = {
 *  'foo': 'bar'
 * };
 * var output = packdown.template(template, variables);
 * @return String
 */
exports.template = function templateDocument (template, variables) {
  //todo: '@/path' syntax
  //todo: '{"key": "value"}' syntax
  return templayed(template)(variables);
};

exports.version = 'PACKDOWN_VERSION';
