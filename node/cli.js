#!/usr/bin/env node

const { commands, version, author } = require('./index');

function showUsage() {
  console.log(`Packdown v${version} © ${(new Date).getFullYear()} ${author}`);
  console.log('Usage: packdown <command> [args]\n');
  console.log('Commands:');
  console.log('\tpack <dir> <file>\tCombine files from <dir> into <file>');
  console.log('\tunpack <file> <dir>\tExtract files from <file> into <dir>');
}

const args = process.argv.slice(2);
const [command, src, dst] = args;

if (command === 'pack') {
  commands.pack(src, dst, function (err) {
    if (err) {
      throw err;
    }
    console.log(`Packed ${src} into ${dst}`);
  });
} else if (command === 'unpack') {
  commands.unpack(src, dst, function (err) {
    if (err) {
      throw err;
    }
    console.log(`Unpacked ${src} into ${dst}`);
  });
} else {
  showUsage();
}
