var fs = require('fs');
var path = require('path');

var shell = require('shelljs');
var promise = require('bluebird');

var precursive = promise.promisify(require('recursive-readdir'));

/**
 * Description
 * @method checkFile
 * @param {} file
 * @return stat
 */
exports.checkFile = function (file) {
  var stat = fs.statSync(file);
  if (!stat.isFile()) {
    throw Error('Not a file');
  }

  return stat;
};

/**
 * Description
 * @method checkDir
 * @param {} dir
 * @return stat
 */
exports.checkDir = function (dir) {
  var stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    throw Error('Not a directory');
  }

  return stat;
};

/**
 * Description
 * @method getDir
 * @param {} dir
 * @return CallExpression
 */
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

/**
 * Create a directory
 * @method createDir
 * @param {String} dir
 */
exports.createDir = function (dir) {
  shell.mkdir('-p', dir);
};

/**
 * Description
 * @method getFile
 * @param {} file
 * @return ObjectExpression
 */
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

/**
 * Write content to file
 * @method putFile
 * @param {String} file
 * @param {String} content
 */
exports.putFile = function (file, content) {
  fs.writeFileSync(file, content);
};
