var nearley = require('nearley');

var grammar = require('./grammar');

module.exports = function (input) {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

  parser.feed(input);

  if (parser.results.length) {
    return parser.results[0];
  }

  return null;
};