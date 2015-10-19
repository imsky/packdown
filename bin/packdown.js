#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

require('shelljs/global');

var stringify = require('json-stable-stringify')
var promise = require('bluebird');
var pluralize = require('pluralize');

var scripts = require('../scripts');
var packdown = require('../index');

var readDir = scripts.readDir;
var filesToDoc = scripts.filesToDoc;

promise.promisifyAll(fs);

var argv = require('yargs').argv;

function log (obj) {
  console.log(stringify(obj, {
    'space': 2
  }));
}

var commands = {
  'read': function (args) {
    var file = args[0];

    if (!file) {
      throw Error('No file to read');
    } else {
      fs.readFileAsync(file)
        .then(function (contents) {
          var string = new Buffer(contents).toString('utf8');
          return packdown.read(string);
        })
        .tap(log);
    }
  },

  'extract': function (args) {
    var file = args[0];
    var dir = args[1];

    if (!file || !dir) {
      throw Error('Input file or output directory is missing');
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
          files.forEach(function (file) {
            var content = file.content.join('\n');
            fs.writeFileSync(path.join(dir, file.name), content);
          });

          console.info(pluralize('file', files.length, true) + ' extracted');
        });
    }
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
    case 'read':
    case 'version':
    case 'extract':
      commands[argv._[0]](argv._.slice(1));
    break;
    default:
      //todo: show usage
      console.error('Not implemented');
      process.exit(1);
    break;
  }
}