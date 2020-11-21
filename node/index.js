#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packdown = require('../dist/packdown.js');

const args = process.argv.slice(2);
const [command] = args;

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

function showUsage() {
  console.log(`Packdown v${packdown.version} © 2015-2020 Ivan Malopinsky`);
  console.log('Usage: packdown <command> [args]\n');
  console.log('Commands:');
  console.log('\tpack <dir> <file>\tCombine files from <dir> into <file>');
  console.log('\tunpack <file> <dir>\tExtract files from <file> into <dir>');
}

if (command === 'pack') {
  const [, src, dst] = args;
  commands.pack(src, dst, function (err) {
    if (err) {
      throw err;
    }
    console.log(`Packed ${src} into ${dst}`);
  });
} else if (command === 'unpack') {
  const [, src, dst] = args;
  commands.unpack(src, dst, function (err) {
    if (err) {
      throw err;
    }
    console.log(`Unpacked ${src} into ${dst}`);
  });
} else {
  showUsage();
}
