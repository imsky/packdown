var fs = require('fs');

var chai = require('chai');
chai.should();

var packdown = require('../index');
var basicDocument = require('./docs/basic.json');
var fixtures = require('./fixtures');

describe('Writer', function () {
  it('should write a basic document', function () {
    var output = packdown.write(basicDocument);

    var expected = fixtures.documents.basic;

    output.should.equal(expected);
  });

  it('should fail with invalid file list', function () {
    (function () {
      packdown.write({});
    }).should.throw();

    (function () {
      packdown.write({
        'files': {}
      });
    }).should.throw();

    (function () {
      packdown.write({
        'files': {
          'noname': {}
        }
      });
    }).should.throw();

    (function () {
      packdown.write({
        'files': [],
        'content': []
      });
    }).should.throw();
  });

  it('should fail with invalid files', function () {
    (function () {
      packdown.write({
        'files': {
          'space space': {
            'name': 'space space'
          }
        }
      });
    }).should.throw();
  });

  it('should fail with invalid file content', function () {
    (function () {
      packdown.write({
        'files': {
          'hello-world': {
            'name': 'hello-world',
            'content': 123
          }
        }
      });
    }).should.throw();
  });

  it('should fail with invalid file encoding');
});