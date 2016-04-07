var nearley = require('nearley');

var grammar = require('./grammar');

exports.nearley = function (input) {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

  parser.feed(input);

  return parser.results[0];
};
