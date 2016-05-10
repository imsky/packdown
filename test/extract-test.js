var fs = require('fs');
var mock = require('mock-fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var extract = require('../lib/commands/extract');
var fixtures = require('./fixtures');

describe('Extract', function () {
  beforeEach(function () {
    mock({
      'example.md': fixtures.documents.example,
      'basic.md': fixtures.documents.basic,
      'template.json': fixtures.variables.template,
      'foo': {
        'bar': 'baz'
      }
    });
  });

  afterEach(mock.restore);

  it('works with valid basic example', function () {
    return extract('example.md', './')
      .then(function (res) {
        res.should.equal(2);
        fs.statSync('./hello-world.js');
        fs.statSync('./hello-world.txt');
      });
  });

  it('works with implicit output directory', function () {
    return extract('example.md')
      .then(function (res) {
        res.should.equal(2);
      });
  });

  it('works with a Buffer as input', function () {
    return extract(fs.readFileSync('example.md'), 'stdin');
  });

  it('works with a Buffer as input without a named output', function () {
    return extract(fs.readFileSync('example.md'));
  });

  it('works with variables', function () {
    return extract('basic.md', 'basic', 'template.json')
      .then(function () {
        var res = fs.readFileSync('./basic/hello-world', 'utf8');
        res.indexOf('baz').should.equal(0);
      });
  });

  it('fails with directory', function () {
    return extract('foo').should.eventually.be.rejected;
  });
});