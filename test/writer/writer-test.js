var fs = require('fs');
var path = require('path');

var diff = require('diff');
var promise = require('bluebird');

var support = require('../support');

var packdown = support.packdown;
var readDir = support.readDir;
var filesToDoc = support.filesToDoc;

var readDirAsync = promise.promisify(readDir);
var filesToDocAsync = promise.promisify(filesToDoc);

var inputDir = './input';
var refDir = './reference';

promise.promisifyAll(fs);

describe('Packdown Writer', function () {

  it('creates basic file', function () {
    var testDir = path.join(__dirname, inputDir, 'basic');
    var refFile = path.join(__dirname, refDir, 'basic', 'output.md');
    return readDirAsync(testDir)
      .then(filesToDocAsync)
      .then(function (doc) {
        return packdown.write(doc);
      })
      .then(function (output) {
        var ref = fs.readFileAsync(refFile)
          .then(function (buffer) {
            return buffer.toString('utf8');
          });

        return [output, ref];
      })
      .spread(function (output, ref) {
        var diffLines = diff.diffLines(output, ref);

        if (diffLines.length > 1) {
          throw Error('Output and reference are different');
        }
      });
  });
});