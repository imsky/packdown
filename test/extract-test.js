var fs = require('fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var extract = require('../lib/commands/extract');

describe('Extract', function () {
  it('works with valid basic example', function () {
    var input = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');
    return extract(input)
      .then(function (res) {
        res.length.should.equal(2);
        res[0].should.have.property('name');
        res[0].name.should.equal('hello-world.js');
        res[1].should.have.property('name');
        res[1].name.should.equal('hello-world.txt');
      });
  });

  it('works with a Buffer as input', function () {
    var input = fs.readFileSync(__dirname + '/docs/example.md');
    return extract(input);
  });
});