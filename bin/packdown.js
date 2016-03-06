#!/usr/bin/env node

var fs = require('fs');

require('shelljs/global');

var promise = require('bluebird');
var pluralize = require('pluralize');
var program = require('commander');

var packdown = require('../index');
var compress = require('../lib/commands/compress');
var extract = require('../lib/commands/extract');
var add = require('../lib/commands/add');

var utilities = require('./utilities');

promise.promisifyAll(fs);

program.version(packdown.version.packageVersion);

program
  .command('compress <input> [output]')
  .description('compress <input> and save to [output]')
  .action(function (input, output) {
    //todo: read files/validate stat within action
    compress(input, output).tap(console.log);
  });

program
  .command('extract <input> <output>')
  .description('extract <input> Packdown doc into <output> directory')
  .action(function (input, output) {
    //todo: read files/validate stat within action

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

program
  .command('add <file> <document>')
  .description('add <file> to Packdown <document>')
  .action(function (file, document) {
    var fileObj = utilities.getFile(file);
    var documentObj = utilities.getFile(document);

    add(fileObj, documentObj)
      .then(function (res) {
        if (res.status === 'added') {
          console.log(file + ' added');
        } else if (res.status === 'replaced') {
          console.log(file + ' replaced');
        }

        utilities.putFile(document, res.output);
      });
  });

if (process.argv.slice(2).length) {
  program.parse(process.argv);
} else {
  program.outputHelp();
}
