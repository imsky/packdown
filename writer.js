var base64 = require('base-64');
var utf8 = require('utf8');

var package = require('./package');

var packageVersion = package.version;
var formatVersion = package.packdownFormatVersion;

function heading (document) {
  if (!document.title) throw Error('Document has no title');

  var ret = [];

  ret.push('# ' + document.title);

  if (document.description) {
    ret.push(document.description);
  }

  return ret.join('\n');
}

function block (file) {
  var ret = [];

  ret.push('## ' + file.path);

  if (file.description) {
    ret.push(file.description);
  }

  var type = [file.language || 'txt'];

  if (file.safe) {
    type.push('base64');
  }

  ret.push('```' + type.join('-'));

  if (file.safe) {
    ret.push(base64.encode(utf8.encode(file.content)));
  } else {
    ret.push(file.content);
  }

  ret.push('```');

  return ret.join('\n');
}

module.exports = function (document) {
  if (!Array.isArray(document.files)) throw Error('File list is not an array');

  var meta = [
    'packdown',
    formatVersion,
    packageVersion
  ];

  var ret = [];

  ret.push('<!-- ' + meta.join('-') + ' -->');

  ret.push(heading(document));

  for(var i = 0, l = document.files.length; i < l; i++) {
    ret.push(block(document.files[i]));
  }

  return ret.join('\n\n');
};