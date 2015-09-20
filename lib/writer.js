var base64 = require('base-64');
var utf8 = require('utf8');

var config = require('../config');

var packageVersion = config.version;
var formatVersion = config.formatVersion;

function heading (document) {
  document.title = document.title || 'Unnamed';

  var ret = [];

  ret.push('# ' + document.title);

  if (document.description) {
    ret.push(document.description);
  }

  return ret.join('\n');
}

function block (file) {
  var ret = [];

  var content = file.content;
  var safe = file.safe !== false;
  var type = file.type;

  if (file.path.indexOf('.') > 0) {
    type = [type || file.path.slice(file.path.lastIndexOf('.') + 1)];
  }

  ret.push('## ' + file.path);

  if (file.description) {
    ret.push(file.description);
  }

  if (safe) {
    type.push('base64');
    content = base64.encode(utf8.encode(file.content));
  }

  ret.push('```' + type.join('-'), content, '```');

  return ret.join('\n');
}

module.exports = function (document) {
  if (!Array.isArray(document.files)) {
    throw Error('File list is not an array');
  }

  var meta = [
    'packdown',
    formatVersion,
    packageVersion
  ];

  var ret = [];

  ret.push('<!-- ' + meta.join('-') + ' -->');

  ret.push(heading(document));

  for (var i = 0, l = document.files.length; i < l; i++) {
    ret.push(block(document.files[i]));
  }

  return ret.join('\n\n');
};