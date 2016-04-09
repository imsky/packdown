var fs = require('fs');
var mock = require('mock-fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var removeFunction = require('../lib/remove')
var removeCommand = require('../lib/commands/remove');
var reader = require('../lib/reader');
var fixtures = require('./fixtures');

describe('Remove function', function () {
  var packdownDoc;
  var exampleFile;

  it('removes a file correctly', function () {
    packdownDoc = reader(fixtures.documents.example);

    Object.keys(packdownDoc.files).length.should.equal(2);

    removeFunction(packdownDoc, 'hello-world.js');

    Object.keys(packdownDoc.files).length.should.equal(1);
  });

  it('does not remove a file that does not exist', function () {
    removeFunction(packdownDoc, 'hello-world.js');
  });

  it('removes a file from a document without content', function () {
    var contentlessDoc = {'files': {'test': true}};

    removeFunction(contentlessDoc, 'test');

    Object.keys(contentlessDoc.files).length.should.equal(0);
  })
});

describe('Remove command', function () {
  var addPromise;
  var addResult;

  var document = fixtures.documents.example;

  beforeEach(function () {
    mock({
      'example.md': document
    });
  });

  afterEach(mock.restore);

  it('removes a file correctly', function () {
    return removeCommand('hello-world.js', 'example.md')
      .then(function (res) {
        res.status.should.equal('removed');
      })
  });

  it('does not remove a file that does not exist', function () {
    return removeCommand('foobar', 'example.md')
      .then(function (res) {
        res.status.should.equal('not found');
      })
  });
});
