var fs = require('fs');

var chai = require('chai');
var asPromised = require('chai-as-promised');
chai.should();
chai.use(asPromised);

var compress = require('../compress');

describe('Packdown', function () {
  describe('compress', function () {
    it('works with valid basic example', function () {
      var output = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');

      return compress(__dirname + '/files/example', '/tmp/packdown-test/example.md')
        .then(function (res) {
          res.should.equal(output);
        });
    });

    it('fails with an invalid output parameter', function () {
      return compress(__dirname + '/files/example', '!@#').should.eventually.be.rejected;
    });

    it('fails with a single file as input', function () {
      return compress(__dirname + '/files/example/hello-world.txt').should.eventually.be.rejected;
    });

    it('fails with no inputs', function () {
      return compress().should.eventually.be.rejected;
    });
  });
});