var normalizePath = require('normalize-path');

/**
 * Convert a set of files to a document
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