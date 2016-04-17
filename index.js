var version = require('./packdown-version');

var parser = require('./lib/parser');

var templayed = require('./vendor/templayed');
var normalizePath = require('./vendor/normalize-path');

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
 * Add a file object to a document object.
 * @param {Object} document
 * @param {Object} file
 * @example
 * var file = {
 *  'name': 'foo',
 *  'content': 'bar'
 * };
 * var input = 'Hello world';
 * var document = packdown.read(input);
 * var output = packdown.add(document, file);
 * @return `null` or overwritten file
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
 * Remove specified path from Packdown document.
 * @param {} document
 * @param {} path
 * @example
 * var input = ['# /foo', '\`\`\`', 'bar', '\`\`\`'].join('\n');
 * var document = packdown.read(input);
 * var output = packdown.remove(document, 'foo');
 * @return `null` or deleted file
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
 * Convert a set of files to a document object.
 * @param {String} root Root directory
 * @param {Array} files An array of file objects with at least a path and a content property
 * @example
 * var root = '/foo';
 * var files = [{'content': 'bar', 'path': '/foo/bar'}];
 * var document = packdown.filesToDoc(root, files);
 * @return Document object
 */
exports.filesToDoc = function filesToDoc (root, files) {
  var document = {
    'content': []
  };

  var basePath = normalizePath(root);

  document.files = files.map(function (file) {
    var ext = file.ext || '';
    var content = file.content;
    var path = file.path;

    if (!content || !content.length) {
      throw Error('Missing file content');
    } else if (!path || !path.length) {
      throw Error('Missing file path');
    } else if (path.length > 256) {
      throw Error('File path is too long');
    }

    var filePath = normalizePath(file.path).slice(basePath.length + 1);
    var extRe = /\.[0-9a-z]+$/i;

    if (!ext && filePath.indexOf('.') !== -1) {
      var extMatch = filePath.match(extRe);

      if (extMatch) {
        ext = extMatch[0];
      }
    }

    var pathWords = filePath.replace(/\W+/g, '');

    if (!pathWords.length) {
      throw Error('Invalid path: ' + filePath);
    }

    var tag = ext;

    if (tag[0] === '.') {
      tag = tag.slice(1);
    }

    //todo: dasherize filePath
    return {
      'name': filePath,
      'tag': tag,
      'content': content
    };
  }).reduce(function (files, file) {
    files[file.name] = file;
    return files;
  }, {});

  return document;
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
exports.template = function (template, variables) {
  return templayed(template)(variables);
};

exports.version = {
  'package': version.package,
  'format': version.format
};
