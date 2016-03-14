var chai = require('chai');

var packdown = require('../index');

describe('Files to doc', function () {
  it('fails with missing file content', function () {
    (function () {
      packdown.filesToDoc('', [{}])
    }).should.throw();
  });

  it('fails with missing file path', function () {
    (function () {
      packdown.filesToDoc('', [{'content': 'foo'}])
    }).should.throw();
  });

  it('fails with long file path', function () {
    (function () {
      packdown.filesToDoc('', [{
        'path': 'abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 'content': 'foo'
      }])
    }).should.throw();
  });

  it('fails with invalid file path', function () {
    (function () {
      packdown.filesToDoc('', [{'path': '~!@#$%^&', 'content': 'foo'}])
    }).should.throw();
  });

  it('works with files without extensions', function () {
    packdown.filesToDoc('', [{'path': 'file', 'content': 'content'}]);

    packdown.filesToDoc('', [{'path': 'file...', 'content': 'content'}]);
  });
});