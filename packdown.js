/*!

Packdown - Markdown-based file container format
Version 0.8.0
(c) 2015-2016 Ivan Malopinsky - http://imsky.co

License: MIT
Issues:  https://github.com/imsky/packdown/issues

*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Packdown = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var write = require('./lib/writer');
var read = require('./lib/reader');
var filesToDoc = require('./lib/files-to-doc');

var templayed = require('./vendor/templayed');
var version = require('./packdown-version');

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

exports.write = write;

exports.read = read;

exports.filesToDoc = filesToDoc;

/**
 * Render a Mustache template
 * @method exports
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

},{"./lib/files-to-doc":3,"./lib/reader":5,"./lib/writer":6,"./packdown-version":8,"./vendor/templayed":9}],2:[function(require,module,exports){
exports.FOUR_SPACES = '    ';
},{}],3:[function(require,module,exports){
var normalizePath = require('normalize-path');

/**
 * Convert a set of files to a document
 * @method filesToDoc
 * @param {String} root Root directory
 * @param files An array of file objects with at least a path and a content property
 * @return Document object
 */
module.exports = function filesToDoc (root, files) {
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
},{"normalize-path":7}],4:[function(require,module,exports){
var rFileHeading = /^\#{1,6} \/([a-z0-9\.\,\_\-\(\)\/]+)$/i;
var rCodeHeading = /^```([a-z0-9][\-a-z0-9]*)$/i;
var rCodeEnd = /^```$/;

/**
 * Parse text into Packdown document
 * @method PackdownLineParser
 * @param {String} input
 * @return Document object
 */
exports.line = function PackdownLineParser (input) {
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
};

},{}],5:[function(require,module,exports){
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
        return line.replace(/^ {4}/, '');
      });
    }
  });

  return document;
};
},{"./constants":2,"./parser":4}],6:[function(require,module,exports){
var FOUR_SPACES = require('./constants').FOUR_SPACES;

/**
 * Generate a Packdown file text block given a Packdown file object
 * @method FileBlock
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
 * Writes a Packdown document from a document object
 * @method Writer
 * @param {Object} document object
 * @return String
 */
module.exports = function Writer (document) {
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

  return content.map(function (line) {
    if (line.file) {
      return FileBlock(files[line.file]);
    } else {
      return line;
    }
  }).join('\n');
};

},{"./constants":2}],7:[function(require,module,exports){
/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

module.exports = function normalizePath(str, stripTrailing) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }
  str = str.replace(/[\\\/]+/g, '/');
  if (stripTrailing !== false) {
    str = str.replace(/\/$/, '');
  }
  return str;
};

},{}],8:[function(require,module,exports){
module.exports={"package":"0.8.0","format":1}
},{}],9:[function(require,module,exports){
// *
// * templayed.js (Uncompressed)
// * The fastest and smallest Mustache compliant Javascript templating library written in 1806 bytes (uncompressed)
// *
// * (c) 2012-2016 Paul Engel (Internetbureau Holder B.V.)
// * Except otherwise noted, templayed.js is licensed under
// * http://creativecommons.org/licenses/by-sa/3.0
// *

module.exports = function(template, vars) {

  var get = function(path, i) {
    i = 1; path = path.replace(/\.\.\//g, function() { i++; return ''; });
    var js = ['vars[vars.length - ', i, ']'], keys = (path == "." ? [] : path.split(".")), j = 0;
    for (j; j < keys.length; j++) { js.push('.' + keys[j]); };
    return js.join('');
  }, tag = function(template) {
    return template.replace(/\{\{(!|&|\{)?\s*(.*?)\s*}}+/g, function(match, operator, context) {
      if (operator == "!") return '';
      var i = inc++;
      return ['"; var o', i, ' = ', get(context), ', s', i, ' = typeof(o', i, ') == "function" ? o', i, '.call(vars[vars.length - 1]) : o', i, '; s', i,' = ( s', i,' || s', i,' == 0 ? s', i,': "") + ""; s += ',
        (operator ? ('s' + i) : '(/[&"><]/.test(s' + i + ') ? s' + i + '.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/>/g,"&gt;").replace(/</g,"&lt;") : s' + i + ')'), ' + "'
      ].join('');
    });
  }, block = function(template) {
    return tag(template.replace(/\{\{(\^|#)(.*?)}}(.*?)\{\{\/\2}}/g, function(match, operator, key, context) {
      var i = inc++;
      return ['"; var o', i, ' = ', get(key), '; ',
        (operator == "^" ?
          ['if ((o', i, ' instanceof Array) ? !o', i, '.length : !o', i, ') { s += "', block(context), '"; } '] :
          ['if (typeof(o', i, ') == "boolean" && o', i, ') { s += "', block(context), '"; } else if (o', i, ') { for (var i', i, ' = 0; i', i, ' < o',
            i, '.length; i', i, '++) { vars.push(o', i, '[i', i, ']); s += "', block(context), '"; vars.pop(); }}']
        ).join(''), '; s += "'].join('');
    }));
  }, inc = 0;

  return new Function("vars", 'vars = [vars], s = "' + block(template.replace(/"/g, '\\"').replace(/[\n|\r\n]/g, '\\n')) + '"; return s;');
};

},{}]},{},[1])(1)
});