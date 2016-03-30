var fs = require('fs');
var mock = require('mock-fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var addFunction = require('../lib/add')
var addCommand = require('../lib/commands/add');
var reader = require('../lib/reader');

describe('Add function', function () {
  var packdownDoc;
  var exampleFile;

  it('adds a file correctly', function () {
    var basicDocument = fs.readFileSync(__dirname + '/docs/basic.md');
    var file = fs.readFileSync(__dirname + '/files/example/hello-world.txt', 'utf8');

    exampleFile = {
      'name': 'new-file',
      'content': file
    };

    packdownDoc = reader(basicDocument);

    Object.keys(packdownDoc.files).length.should.equal(1);

    addFunction(packdownDoc, exampleFile);

    Object.keys(packdownDoc.files).length.should.equal(2);
  });

  it('replaces a file correctly', function () {
    Object.keys(packdownDoc.files).length.should.equal(2);

    var result = addFunction(packdownDoc, exampleFile);

    result.name.should.equal('new-file');
  });
});

describe('Add command', function () {
  var addPromise;
  var addResult;

  beforeEach(function () {
    var document = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');
    var file = fs.readFileSync(__dirname + '/files/example/hello-world.txt', 'utf8');

    mock({
      'new-file.xyz': file,
      'hello-world.txt': file,
      'example.md': document
    });
  });

  afterEach(mock.restore);

  it('adds files correctly', function () {
    return addCommand('new-file.xyz', 'example.md')
      .then(function (res) {
        res.status.should.equal('added');
      });
  });

  it('replaces files correctly', function () {
    return addCommand('hello-world.txt', 'example.md')
      .then(function (res) {
        res.status.should.equal('replaced');
        addResult = res.output;
      });
  });

  it('outputs a valid document', function () {
    var doc = reader(addResult);
    Object.keys(doc.files).length.should.equal(2);
    doc.files.should.have.property('hello-world.txt');
  });
});
