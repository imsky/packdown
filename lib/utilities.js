var fs = require('fs');
var path = require('path');

var shell = require('shelljs');
var promise = require('bluebird');

var precursive = promise.promisify(require('recursive-readdir'));

exports.checkFile = function (file) {
  var stat = fs.statSync(file);
  if (!stat.isFile()) {
    throw Error('Not a file');
  }

  return stat;
};

exports.checkDir = function (dir) {
  var stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    throw Error('Not a directory');
  }

  return stat;
};

exports.getDir = function (dir) {
  exports.checkDir(dir);

  if (dir === '.' || dir === './') {
    dir = process.cwd();
  }

  return precursive(dir)
    .map(exports.getFile)
    .then(function (files) {
      return {
        'root': dir,
        'files': files
      };
    });
};

exports.createDir = function (dir) {
  shell.mkdir('-p', dir);
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
