var chai = require('chai');
chai.should();

var nearley = require('nearley');

var grammar = require('../lib/grammar');

var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

describe('Grammar', function () {
  it('should validate basic document', function () {
    var input = [
      '# Example',
      '## /hello',
      '```',
      'world',
      '```',
      '',
      'Packdown works!',
      ''
    ].join('\n');

    parser.feed(input);
    var results = parser.results[0];

    results.files.should.have.property('hello');
    results.content.slice(-1).toString().should.equal('Packdown works!');
  });

  it('should fail if a file header starts on same line as an ending code block');
  it('should fail with an invalid file name');
  it('should fail with a code block tag with an empty qualifier');
});