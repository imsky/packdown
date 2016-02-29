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
    function action (input, output) {
      extract(input, output)
      .then(function (files) {
        console.log(pluralize('file', files.length, true) + ' extracted');
      });
    }

    if (input === '-' && !process.stdin.isTTY) {
      var stdin = process.stdin;
      var input = [];

      stdin.on('readable', function () {
        var buffer = this.read();

        if (buffer) {
          input.push(buffer);
        }
      });

      stdin.on('end', function () {
        input = Buffer.concat(input);
        action(input, output);
      });
    } else {
      action(input, output);
    }
  });

if (process.argv.slice(2).length) {
  program.parse(process.argv);
} else {
  program.outputHelp();
}
