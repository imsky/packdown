#!/usr/bin/env node

var fs = require('fs');
var stringify = require('json-stable-stringify')

var promise = require('bluebird');

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
      commands[argv._[0]](argv._.slice(1));
    break;
    default:
      throw Error('Not implemented');
    break;
  }
}