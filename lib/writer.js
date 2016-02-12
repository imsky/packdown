var base64 = require('base-64');
var utf8 = require('utf8');

var version = require('./version');

var FOUR_SPACES = require('./constants').FOUR_SPACES;

function DocHeader (document) {
  var ret = [];

  var name = document.name;
  var info = document.info || '';

  if (!name) {
    throw Error('Document name is missing');
  }

  var DocHeader = '# ' + name;

  ret.push(DocHeader);

  if (info) {
    ret.push(info);
  }

  return ret.join('\n');
}

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

  var FileHeader = '## ' + name;

  ret.push(FileHeader);

  if (info) {
    ret.push(info);
  }

  var CodeBlockStart = '```' + tag;

  var encodedContent = content;

  switch (encoding) {
    case 'space':
      encodedContent = content.split('\n')
        .map(function (line) {
          return FOUR_SPACES + line;
        })
        .join('\n');
    case 'plain':
      break;
    default:
      throw Error('Unsupported file encoding: ' + encoding);
  }

  ret.push(CodeBlockStart, encodedContent, '```');

  return ret.join('\n');
}

function Metadata () {
  var packageVersion = version.packageVersion;
  var formatVersion = version.formatVersion;

  var meta = [
    'packdown',
    formatVersion,
    packageVersion
  ];

  return '<!-- ' + meta.join('-') + ' -->';
}

module.exports = function (document) {
  if (!Array.isArray(document.files)) {
    throw Error('File list is not an array');
  }

  if (!document.files.length) {
    throw Error('File list is empty');
  }

  var FileList = document.files.map(FileBlock);

  var Document = [
    DocHeader(document),
    FileList.join('\n\n'),
    Metadata()
  ];

  return Document.join('\n\n');
};