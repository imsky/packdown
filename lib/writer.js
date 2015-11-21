var base64 = require('base-64');
var utf8 = require('utf8');

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

  if (!name) {
    throw Error('File name is missing');
  }

  var FileHeader = '## ' + name;

  ret.push(FileHeader);

  if (info) {
    ret.push(info);
  }

  var CodeBlockStart = '```' + tag;

  //todo: space-encode by default
  ret.push(CodeBlockStart, content, '```');

  return ret.join('\n');
}

function Metadata (options) {
  var packageVersion = options.packageVersion;
  var formatVersion = options.formatVersion;

  var meta = [
    'packdown',
    formatVersion,
    packageVersion
  ];

  return '<!-- ' + meta.join('-') + ' -->';
}

module.exports = function (document, options) {
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
    Metadata(options)
  ];

  return Document.join('\n\n');
};