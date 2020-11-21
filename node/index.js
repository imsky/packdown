const fs = require('fs');
const path = require('path');

require('reify');

const packdown = require('../src').default;
const packageJSON = require('../package.json');
const { author, version } = packageJSON;

const hostObject = {
  readFile: function (path, cb) {
    return fs.readFile(path, 'utf8', cb);
  },
  readDir: function (path, cb) {
    return fs.readdir(path, cb);
  },
  joinPath: function (a, b) {
    return path.join(a, b);
  },
  writeFile: function (path, data, cb) {
    return fs.writeFile(path, data, cb);
  }
};

const commands = packdown.commandFactory(hostObject);

module.exports = { commands, version, author };
