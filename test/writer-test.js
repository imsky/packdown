var chai = require('chai');
chai.should();

var writer = require('../lib/writer');

describe('Writer', function () {
  it('should write a basic document');

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

  it('should fail with a missing document name', function () {
    (function () {
      writer({
        'files': [{
          'name': 'test'
        }]
      });
    }).should.throw();
  });

  it('should fail with invalid file encoding');
});