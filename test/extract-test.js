var fs = require('fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var extract = require('../lib/commands/extract');

describe('Extract', function () {
  it('works with valid basic example', function () {
    return extract(__dirname + '/docs/example.md', '/tmp/packdown-test/example-docs')
      .then(function (res) {
        res.length.should.equal(2);
        res[0].should.have.property('name');
        res[0].name.should.equal('hello-world.js');
        res[1].should.have.property('name');
        res[1].name.should.equal('hello-world.txt');
      });
  });

  it('fails with missing input file', function () {
    return extract('__fake').should.eventually.be.rejected;
  });

  it('fails with invalid input file', function () {
    return extract(__dirname + '/docs').should.eventually.be.rejected;
  });

  it('fails with invalid output', function () {
    return extract(__dirname + '/docs/example.md').should.eventually.be.rejected;
  });
});