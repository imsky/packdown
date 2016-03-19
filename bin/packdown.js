#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var shell = require('shelljs');

var promise = require('bluebird');
var pluralize = require('pluralize');
var program = require('commander');

var packdown = require('../index');
var compress = require('../lib/commands/compress');
var extract = require('../lib/commands/extract');
var add = require('../lib/commands/add');
var remove = require('../lib/commands/remove');

var utilities = require('./utilities');

promise.promisifyAll(fs);

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
  .description('extract <input> Packdown doc into [output] directory')
  .action(function (input, output) {
    var outputUndefined = typeof output === 'undefined';

    function action (inputFile, outputDir) {
      shell.mkdir('-p', outputDir);

      extract(inputFile)
        .then(function (files) {
          var extracted = 0;

          files.forEach(function (file) {
            try {
              utilities.putFile(path.join(outputDir, file.name), file.content);
              extracted++;
            } catch (e) {
              console.error('Error extracting ' + file.name);
            }
          });

          console.log(pluralize('file', extracted, true) + ' extracted');
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
        output = outputUndefined ? 'stdin' : output;
        action(input, output);
      });
    } else {
      var inputFile = utilities.getFile(input);
      output = outputUndefined ? inputFile.props.name : output;
      action(inputFile, output);
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

program
  .command('remove <file> <document>')
  .description('remove <file> from Packdown <document>')
  .action(function (file, document) {
    var documentObj = utilities.getFile(document);

    remove(file, documentObj)
      .then(function (res) {
        if (res.status === 'not found') {
          console.log(file + ' not found');
        } else if (res.status === 'removed') {
          console.log(file + ' removed');
        }

        utilities.putFile(document, res.output);
      });
  });

if (process.argv.slice(2).length) {
  program.parse(process.argv);
} else {
  program.outputHelp();
}
