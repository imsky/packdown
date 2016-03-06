var fs = require('fs');

exports.checkFile = function (file) {
  var stat = fs.statSync(file);
  if (!stat.isFile()) {
    throw Error('Not a file');
  }

  return stat;
};

exports.getFile = function (file) {
  exports.checkFile(file);
  return {
    'path': file,
    'content': fs.readFileSync(file, 'utf8')
  };
};

exports.putFile = function (file, content) {
  return fs.writeFileSync(file, content);
};
