var FOUR_SPACES = require('./constants').FOUR_SPACES;

/**
 * Generate a Packdown file text block given a Packdown file object
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
