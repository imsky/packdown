var fs = require('fs');

var chai = require('chai');
chai.should();

var parser = require('../lib/parser');

describe('Line parser', function () {
  var lineParser = parser.line;

  it('should fail on unfinished file', function () {
    var text = [
      '# /file1',
      '# /file2'
    ].join('\n');

    (function () {
      lineParser(text);
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
      lineParser(text);
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
      lineParser(text);
    }).should.not.throw();
  });

  it('should fail on incomplete document', function () {
    var text = [
      '# /file',
      '```',
      'hello world'
    ].join('\n');

    (function () {
      lineParser(text);
    }).should.throw();
  });
});
