#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

require('shelljs/global');

var promise = require('bluebird');
var pluralize = require('pluralize');
var program = require('commander');

var packdown = require('../index');
var compress = require('../lib/commands/compress');
var extract = require('../lib/commands/extract');

promise.promisifyAll(fs);

program.version(packdown.version.packageVersion);

//todo: validate command
//todo: extract metadata
//todo: compress metadata

program
  .command('compress <input> [output]')
  .description('compress <input> and save to [output]')
  .action(function (input, output) {
    compress(input, output)
      .then(console.log);
  });

//todo: add verbose option
//todo: add stdin
//todo: extract from directory of packdown files
//todo: extract individual file
program
  .command('extract <input> <output>')
  .description('extract <input> Packdown doc into <output> directory')
  .action(function (input, output) {
    extract(input, output)
      .then(function (files) {
        console.log(pluralize('file', files.length, true) + ' extracted');
      });
  });


program
  //todo: variadic support
  .command('add <document> <file>')
  .description('add <file> to <document>')
  .action(function (document, file) {
    //does document exist
    //does file exist
    //read document
    //read file
    //add file using add() API method
    //write new packdown file
  });

program
  .command('remove <document> <path>')
  .description('remove file at <path> from <document>')
  .action(function (document, file) {
    //does document exist
    //does file exist
    //read document
    //read file
    //remove file using remove() API method
    //write new packdown file
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}