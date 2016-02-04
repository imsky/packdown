var assert = require('assert');

var validPath = require('is-valid-path');

module.exports = function (files) {
  var document = {
    'name': 'Untitled'
  };

  document.files = files.map(function (file) {
    var ext = file.ext;
    var content = file.content;
    var path = file.path;

    assert(ext && ext.length, 'Missing file extension');
    assert(content && content.length, 'Missing file content');
    assert(path && path.length, 'Missing file path');

    assert(ext.length < 32, 'File extension is too long');
    assert(path.length < 256, 'File path is too long');

    var isValidPath = validPath(path);
    var pathWords = path.replace(/\W+/g, '');

    assert(isValidPath && pathWords.length, 'Invalid path: ' + path);

    var tag = ext;

    if (tag[0] === '.') {
      tag = tag.slice(1);
    }

    return {
      'name': path,
      'tag': tag,
      'content': content
    };
  });

  return document;
};