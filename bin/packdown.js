#!/usr/bin/env node

//todo: overwrite existing files preserving descriptions
//todo: extract from directory of packdown files
//todo: usage
//todo: commander.js
//todo: mustache template

var path = require('path');
var fs = require('fs');

require('shelljs/global');

var stringify = require('json-stable-stringify')
var promise = require('bluebird');
var pluralize = require('pluralize');
var yargs = require('yargs');

var scripts = require('../scripts');
var packdown = require('../index');

promise.promisifyAll(fs);
promise.promisifyAll(scripts);

var argv = yargs.argv;

function log (obj) {
  console.log(stringify(obj, {
    'space': 2
  }));
}

var commands = {
  'extract': function (args) {
    var file = args[0];
    var dir = args[1];

    if (!file) {
      throw Error('Input file is missing');
    } else if(!dir) {
      throw Error('Output directory is missing');
    } else {
      mkdir('-p', dir);

      fs.readFileAsync(file)
        .then(function (contents) {
          return new Buffer(contents).toString('utf8')
        })
        .then(packdown.read)
        .then(function (doc) {
          if (doc.files.length) {
            return doc.files;
          } else {
            throw Error('No files embedded in document');
          }
        })
        .then(function (files) {
          if (!files || !files.length) {
            return;
          }

          files.forEach(function (file) {
            var content = file.content.join('\n');
            fs.writeFileSync(path.join(dir, file.name), content);
          });

          console.info(pluralize('file', files.length, true) + ' extracted');
        });
      }
    },

  'compress': function (args) {
    var pattern = args[0];
    var output = args[1];

    var globPattern = /\*|\?|\!|\+|\[/;

    promise.resolve(globPattern.test(pattern))
      .then(function (isGlob) {
        var fn = scripts.globDirAsync;

        if (!isGlob) {
          var stat = fs.statSync(pattern);

          if (!stat.isFile() && stat.isDirectory()) {
            fn = scripts.readDirAsync;
          }
        }

        return fn(pattern);
      })
      .then(scripts.filesToDocAsync)
      .then(packdown.write)
      .then(function (doc) {
        if (!output) {
          console.log(doc);
        } else {
          fs.writeFileSync(output, doc);
        }
      });
  },

  'version': function () {
    log(packdown.version);
  }
};

if (!argv._.length) {
  console.log('Usage: packdown read <file.packdown>');
  process.exit(0);
} else {
  switch(argv._[0]) {
    case 'version':
    case 'extract':
    case 'compress':
      commands[argv._[0]](argv._.slice(1));
    break;
    default:
      console.error('Not implemented');
      process.exit(1);
    break;
  }
}