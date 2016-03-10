var fs = require('fs');
var path = require('path');

exports.checkFile = function (file) {
  var stat = fs.statSync(file);
  if (!stat.isFile()) {
    throw Error('Not a file');
  }

  return stat;
};

exports.getFile = function (file) {
  var stat = exports.checkFile(file);
  var props = path.parse(file);

  return {
    'path': file,
    'stat': stat,
    'props': props,
    'content': fs.readFileSync(file, 'utf8')
  };
};

exports.putFile = function (file, content) {
  return fs.writeFileSync(file, content);
};
