var fs = require('fs');
var path = require('path');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var should = chai.should();
chai.use(chaiAsPromised);

var promise = require('bluebird');

var support = require('../support');

var packdown = support.packdown;

var inputDir = './input';

promise.promisifyAll(fs);

describe('Packdown Reader', function () {
  it('correctly reads a basic file', function () {
    return fs.readFileAsync(path.join(__dirname, inputDir, 'basic.md'))
      .then(function (output) {
        return new Buffer(output).toString('utf8');
      })
      .then(packdown.read)
      .then(function (output) {
        output.should.have.all.keys('preamble', 'name', 'info', 'files');
        output.should.have.deep.property('preamble.formatVersion');
        output.should.have.deep.property('preamble.packageVersion');
        output.name.should.equal('Basic Document');
        output.files.length.should.equal(1);

        var file = output.files[0];

        file.name.should.equal('hello.js');
        should.equal(file.info, null);
        file.tag.should.equal('js');
        file.content.length.should.equal(1);

        var content = file.content.join('');

        content.should.equal('var hello = World();');
      });
  });

  it('correctly reads a file with descriptions', function () {
    return fs.readFileAsync(path.join(__dirname, inputDir, 'basic-description.md'))
      .then(function (output) {
        return new Buffer(output).toString('utf8');
      })
      .then(packdown.read)
      .then(function (output) {
        var info = output.info.join('');

        info.should.equal('This is a basic document.');

        var file = output.files[0];
        var fileInfo = file.info.join('');

        fileInfo.should.equal('Hello world.');
      });
  });
});