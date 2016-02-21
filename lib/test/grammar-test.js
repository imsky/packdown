var chai = require('chai');
chai.should();

describe('Grammar', function () {
  it('should validate basic document');
  it('should fail if a file header starts on same line as an ending code block');
  it('should fail with a H1 file header');
  it('should fail with an invalid file name');
  it('should fail with a code block tag with an empty qualifier');
});