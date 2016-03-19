var fs = require('fs');
var mock = require('mock-fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var compress = require('../lib/commands/compress');

//todo: factor these out into common file
var exampleDoc = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');
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

  it('fails with no inputs', function () {
    return compress().should.eventually.be.rejected;
  });
});