var fs = require('fs');
var path = require('path');

var diff = require('diff');

var support = require('./support');

var packdown = require('../index');

describe('Packdown', function () {
  describe('writer', function () {
    it('creates simple file correctly', function () {
      var reference = fs.readFileSync('test/reference/simple/reference.md', {
        'encoding': 'utf8'
      });

      return support.docFromDir('test/files/simple')
        .then(function (doc) {
          var packdoc = packdown.write(doc);

          var difference = diff.diffLines(reference, packdoc);

          if (difference.length > 1) {
            console.log(difference);
            throw Error('Difference in output detected');
          }

          return packdoc;
        });
    });
  });
});