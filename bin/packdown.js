#!/usr/bin/env node

var fs = require('fs');

var promise = require('bluebird');
var pluralize = require('pluralize');
var program = require('commander');

var packdown = require('../index');
var compress = require('../lib/commands/compress');
var extract = require('../lib/commands/extract');
var add = require('../lib/commands/add');
var remove = require('../lib/commands/remove');
var template = require('../lib/commands/template');

program.version(packdown.version.packageVersion);

program
  .command('compress <input> [output]')
  .description('compress <input> and save to [output]')
  .action(function (input, output) {
    compress(input, output)
      .then(function (res) {
        if (!output) {
          console.log(res);
        }
      });
  });

program
  .command('extract <input> [output]')
  .description('extract <input> file into [output] directory')
  .action(function (input, output) {
    function action (_input, _output) {
      extract(_input, _output)
        .then(function (files) {
          console.log(pluralize('file', files, true) + ' extracted');
        });
    }

    if (input === '-' && !process.stdin.isTTY) {
      var stdin = [];

      process.stdin.on('readable', function () {
        var buffer = this.read();

        if (buffer) {
          stdin.push(buffer);
        }
      });

      process.stdin.on('end', function () {
        stdin = Buffer.concat(stdin);
        action(stdin, output || 'stdin');
      });
    } else {
      action(input, output);
    }
  });

program
  .command('template <input> <variables> [output]')
  .description('extract <input> file templated with <variables> file to [output] directory')
  .action(function (input, variables, output) {
    template(input, variables, output)
      .then(function(files) {
        console.log(pluralize('file', files, true) + ' extracted');
      });
  });

program
  .command('add <file> <document>')
  .description('add <file> to Packdown <document>')
  .action(function (file, document) {
    add(file, document)
      .then(function (res) {
        if (res.status === 'added') {
          console.log(file + ' added');
        } else if (res.status === 'replaced') {
          console.log(file + ' replaced');
        }
      });
  });

program
  .command('remove <file> <document>')
  .description('remove <file> from Packdown <document>')
  .action(function (file, document) {
    remove(file, document)
      .then(function (res) {
        if (res.status === 'not found') {
          console.log(file + ' not found');
        } else if (res.status === 'removed') {
          console.log(file + ' removed');
        }
      });
  });

if (process.argv.slice(2).length) {
  program.parse(process.argv);
} else {
  program.outputHelp();
}
