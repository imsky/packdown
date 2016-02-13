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

program
  .command('compress <input> [output]')
  .description('compress <input> and save to [output]')
  .action(function (input, output) {
    compress(input, output)
      .then(console.log);
  });

program
  .command('extract <input> <output>')
  .description('extract <input> Packdown doc into <output> directory')
  .action(function (input, output) {
    extract(input, output)
      .then(function (files) {
        console.log(pluralize('file', files.length, true) + ' extracted');
      });
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}