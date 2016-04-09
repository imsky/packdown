var fs = require('fs');

var chai = require('chai');
chai.should();

var writer = require('../lib/writer');
var basicDocument = require('./docs/basic.json');
var fixtures = require('./fixtures');

describe('Writer', function () {
  it('should write a basic document', function () {
    var output = writer(basicDocument);

    var expected = fixtures.documents.basic;

    output.should.equal(expected);
  });

  it('should fail with invalid file list', function () {
    (function () {
      writer({});
    }).should.throw();

    (function () {
      writer({
        'files': []
      });
    }).should.throw();

    (function () {
      writer({
        'files': [{}]
      });
    }).should.throw();
  });

  it('should fail with invalid files', function () {
    (function () {
      writer({
        'files': [{'name': 'space space'}],
        'name': 'File with spaces'
      });
    }).should.throw();
  });

  it('should fail with invalid file content');

  it('should fail with invalid file encoding');
});