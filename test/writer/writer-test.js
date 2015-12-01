var fs = require('fs');
var path = require('path');

var diff = require('diff');
var promise = require('bluebird');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var should = chai.should();
chai.use(chaiAsPromised);

var scripts = require('../../scripts');
var write = require('../../lib/writer');

var readDir = scripts.readDir;
var filesToDoc = scripts.filesToDoc;

var readDirAsync = promise.promisify(readDir);
var filesToDocAsync = promise.promisify(filesToDoc);

var inputDir = './input';
var refDir = './reference';

promise.promisifyAll(fs);

describe('Packdown Writer', function () {
  var options = {
    'formatVersion': 1,
    'packageVersion': '0.0.0'
  };

  it('fails with invalid document', function () {
    return promise.resolve({})
      .then(function (doc) {
        return write(doc, options);
      })
      .should.be.rejected;
  });

  it('fails without files', function () {
    return promise.resolve({'files': []})
      .then(function (doc) {
        return write(doc, options);
      })
      .should.be.rejected;
  });

  it('fails with invalid files', function () {
    return promise.resolve({'files': [{}]})
      .then(function (doc) {
        return write(doc, options);
      })
      .should.be.rejected;
  });

  it('fails with missing document name', function () {
    return promise.resolve({
    'info': 'foo',
    'files': [{
      'name': 'abc',
      'info': 'bar',
      'tag': null,
      'content': ['bar']
    }]})
      .then(function (doc) {
        return write(doc, options);
      })
      .should.be.rejected;
  });

  it('creates basic document', function () {
    var testDir = path.join(__dirname, inputDir, 'basic');
    var refFile = path.join(__dirname, refDir, 'basic', 'output.md');
    return readDirAsync(testDir)
      .then(filesToDocAsync)
      .then(function (doc) {
        return write(doc, options);
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
          console.error(diffLines);
          throw Error('Output and reference are different');
        }
      });
  });
});