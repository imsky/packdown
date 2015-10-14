var fs = require('fs');
var path = require('path');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var should = chai.should();
chai.use(chaiAsPromised);

var promise = require('bluebird');

var read = require('../../lib/reader');

var inputDir = './input';

promise.promisifyAll(fs);

function readInputFile(filename) {
  return fs.readFileAsync(path.join(__dirname, inputDir, filename))
    .then(function (output) {
      return new Buffer(output).toString('utf8');
    });
}

describe('Packdown Reader', function () {

  it('fails on an invalid file', function () {
    return promise.resolve(' ')
      .then(read)
      .should.be.rejected;
  });

  it('correctly reads a basic document', function () {
    return readInputFile('basic.md')
      .then(read)
      .then(function (output) {
        output.should.have.all.keys('metadata', 'name', 'info', 'files');
        output.should.have.deep.property('metadata.formatVersion');
        output.should.have.deep.property('metadata.packageVersion');
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

  it('correctly reads a document with descriptions', function () {
    return readInputFile('basic-description.md')
      .then(read)
      .then(function (output) {
        var info = output.info.join('');

        info.should.equal('This is a basic document.');

        var file = output.files[0];
        var fileInfo = file.info.join('');

        fileInfo.should.equal('Hello world.');
      });
  });

  it('correctly reads a document with multiple files', function() {
    return readInputFile('basic-multiple.md')
      .then(read)
      .then(function(output) {
        var files = output.files;

        files.length.should.equal(2);
        files[0].should.deep.equal({
          name: 'hello.js',
          info: ['', 'Hello world.', ''],
          tag: 'js',
          content: ['var hello = World();']
        });
        files[1].should.deep.equal({
          name: 'world.js',
          info: ['', 'Hello again, world.', ''],
          tag: 'js',
          content: ['var world = Hello();']
        });
      });
  });
});