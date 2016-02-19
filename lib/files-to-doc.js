var validPath = require('is-valid-path');

module.exports = function (files) {
  var document = {
    'name': 'Untitled'
  };

  document.files = files.map(function (file) {
    var ext = file.ext;
    var content = file.content;
    var path = file.path;

    if (!ext || !ext.length) {
      throw Error('Missing file extension');
    } else if (!content || !content.length) {
      throw Error('Missing file content');
    } else if (!path || !path.length) {
      throw Error('Missing file path');
    } else if (ext.length > 32) {
      throw Error('File extension is too long');
    } else if (path.length > 256) {
      throw Error('File path is too long');
    }

    var pathWords = path.replace(/\W+/g, '');

    if (!validPath(path) || !pathWords.length) {
      throw Error('Invalid path: ' + path);
    }

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