var chai = require('chai');
chai.should();

var writer = require('../writer');

describe('Packdown', function () {
  describe('writer', function () {
    it('should write basic document');

    it('should fail with invalid file list', function () {
      (function () {
        writer({});
      }).should.throw();

      (function () {
        writer({'files': []});
      }).should.throw();
    });

    it('should fail with a missing filename');
    it('should fail with invalid file encoding');
  });
});