var fs = require('fs');

var chai = require('chai');
chai.should();

var diff = require('line-diff');

var compress = require('../compress');

describe('Packdown', function () {
  describe('compress', function () {
    it('works with the example file set', function () {
      var output = fs.readFileSync(__dirname + '/docs/example.md', 'utf8');

      return compress(__dirname + '/files/example')
        .then(function (res) {
          var lineDiff = diff(res, output);
          var changedLines = lineDiff.changes.filter(function (line) {
            return line.changes;
          }).length;

          changedLines.should.equal(0);
        });
    });
  });
});