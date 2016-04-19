var fs = require('fs');
var path = require('path');

var shell = require('shelljs');
var promise = require('bluebird');
var isBinary = require('isbinaryfile');

var precursive = promise.promisify(require('recursive-readdir'));

/**
 * Ensure that a given path is a file
 * @param {String} file - path to file
 * @return stat
 */
exports.checkFile = function checkFile (file) {
  var stat = fs.statSync(file);
  if (!stat.isFile()) {
    throw Error('Not a file');
  }

  return stat;
};

/**
 * Ensure that a given path is a directory
 * @param {String} dir - path to directory
 * @return stat
 */
exports.checkDir = function checkDir (dir) {
  var stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    throw Error('Not a directory');
  }

  return stat;
};

/**
 * Description
 * @param {} dir
 * @return CallExpression
 */
exports.getDir = function getDir (dir) {
  exports.checkDir(dir);

  if (dir === '.' || dir === './') {
    dir = process.cwd();
  }

  return precursive(dir)
    .map(exports.getFile)
    .then(function getDirRes (files) {
      return {
        'root': dir,
        'files': files
      };
    });
};

/**
 * Create a directory
 * @param {String} dir
 */
exports.createDir = function createDir (dir) {
  shell.mkdir('-p', dir);
};

/**
 * Description
 * @param {} file
 * @return ObjectExpression
 */
exports.getFile = function getFile (file) {
  var stat = exports.checkFile(file);
  var props = path.parse(file);

  return {
    'path': file,
    'stat': stat,
    'props': props,
    'content': fs.readFileSync(file, 'utf8')
  };
};

/**
 * Write content to file
 * @param {String} file
 * @param {String} content
 */
exports.putFile = function putFile (file, content) {
  fs.writeFileSync(file, content);
};


/**
 * Check if file is binary
 * @param {String} file - path to file
 */
exports.isBinaryFile = function (file) {
  return isBinary.sync(file);
};
