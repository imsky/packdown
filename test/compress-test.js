var fs = require('fs');
var mock = require('mock-fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var compress = require('../lib/commands/compress');
var fixtures = require('./fixtures');

var exampleDoc = fixtures.documents.example;
var exampleFiles = {
  'files': {
    'hello-world.js': fs.readFileSync(__dirname + '/files/example/hello-world.js', 'utf8'),
    'hello-world.txt': fs.readFileSync(__dirname + '/files/example/hello-world.txt', 'utf8')
  }
};

describe('Compress', function () {
  beforeEach(function () {
    mock(exampleFiles);
  });

  afterEach(mock.restore);

  it('works with valid basic example', function () {
    return compress('files/', 'example.md')
      .then(function (res) {
        var output = fs.readFileSync('example.md', 'utf8');
        res.should.equal(exampleDoc);
        output.should.equal(exampleDoc);
      });
  });

  it('works with files at multiple levels');

  it('works when compressing the current directory', function () {
    return compress('.');
  });

  it('fails if dasherizing causes a name collision', function () {
    mock(Object.assign({
      'hello world.js': 'foo'
    }, exampleFiles.files));

    return compress('.').should.eventually.be.rejected;

    mock.restore();
  });

  it('fails with no inputs', function () {
    return compress().should.eventually.be.rejected;
  });

  it('fails with bad inputs', function () {
    return compress('files/hello-world.js').should.eventually.be.rejected;
  });
});