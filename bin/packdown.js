#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

require('shelljs/global');

var promise = require('bluebird');
var pluralize = require('pluralize');
var program = require('commander');

var scripts = require('../scripts');
var packdown = require('../index');

promise.promisifyAll(fs);
promise.promisifyAll(scripts);

program.version(packdown.version.packageVersion);

//todo: validate command
//todo: extract metadata
//todo: compress metadata

program
  .command('compress <input> [output]')
  .description('create Packdown doc from <input> directory and optionally write it to [output]')
  .action(function (input, output) {
    var stat = fs.statSync(input);

    if (input === '.' || input === './') {
      input = process.cwd();
    }

    if (!stat.isFile() && stat.isDirectory()) {
      promise.resolve(scripts.readDirAsync(input))
        .then(scripts.filesToDocAsync)
        .then(packdown.write)
        .then(function (doc) {
          if (!output) {
            console.log(doc);
          } else {
            fs.writeFileSync(output, doc);
          }
        });
    } else {
      throw Error('Not a directory:' + input);
    }
  });

//todo: add verbose option
//todo: add stdin
//todo: extract from directory of packdown files
//todo: extract individual file
program
  .command('extract <input> <output>')
  .description('extract <input> Packdown doc into <output> directory')
  .action(function (input, output) {
      mkdir('-p', output);

      fs.readFileAsync(input)
        .then(function (contents) {
          return new Buffer(contents).toString('utf8');
        })
        .then(packdown.read)
        .then(function (doc) {
          if (doc.files.length) {
            return doc.files;
          } else {
            throw Error('No files in document');
          }
        })
        .then(function (files) {
          var filesExtracted = 0;

          if (files && files.length) {
            files.forEach(function (file) {
              var content = file.content.join('\n');
              fs.writeFileSync(path.join(output, file.name), content);
              filesExtracted++;
            });
          }

          console.info(pluralize('file', filesExtracted, true) + ' extracted');
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
