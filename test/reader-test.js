var fs = require('fs');

var chai = require('chai');
chai.should();

var packdown = require('../index');
var fixtures = require('./fixtures');

var basicDocument = fixtures.documents.basic;
var basicResult = require('./docs/basic.json');
var edgeCaseDocument = fixtures.documents.edgeCase;

describe('Reader', function () {
  it('should read a basic document', function () {
    var output = packdown.read(basicDocument);

    Object.keys(output.files).length.should.equal(1);

    output = packdown.read(basicDocument, {'disableSpaceEncoding': true});
  });

  it('should read an edge-case document', function () {
    var output = packdown.read(edgeCaseDocument);
    Object.keys(output.files).length.should.equal(3);
  });

  it('should fail on unfinished file', function () {
    var text = [
      '# /file1',
      '# /file2'
    ].join('\n');

    (function () {
      packdown.read(text);
    }).should.throw();
  });

  it('should fail on a prematurely open code block within file', function () {
    var text = [
      '# /file',
      '```txt',
      'abc',
      '```txt',
      'def',
      '```'
    ].join('\n');

    (function () {
      packdown.read(text);
    }).should.throw();
  });

  it('should not fail on code block outside of a file', function () {
    var text = [
      '# /file',
      '```',
      'hello world',
      '```',
      '',
      '```',
      'hello again',
      '```'
    ].join('\n');

    (function () {
      packdown.read(text);
    }).should.not.throw();
  });

  it('should fail on incomplete document', function () {
    var text = [
      '# /file',
      '```',
      'hello world'
    ].join('\n');

    (function () {
      packdown.read(text);
    }).should.throw();
  });
});