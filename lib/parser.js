var nearley = require('nearley');

var grammar = require('./grammar');

exports.nearley = function (input) {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

  parser.feed(input);

  return parser.results[0];
};

exports.line = function (input) {
  var rFileHeading = /^\#{1,6} ([a-z0-9\.\,\_\-\(\)\/]+)\//i;
  var rCodeHeading = /^```([a-z0-9][\-a-z0-9]*)?$/i;
  var rCodeEnd = /^```$/;
  var ctx = {
    'DOCUMENT': 1,
    'FILE': 2,
    'CODE': 3
  };

  var document = {
    'files': {},
    'content': []
  };

  var text = String(input);
  var lines = text.split('\n');

  var context = ctx.DOCUMENT;
  var line = lines[0];

  for(var i = 0, l = lines.length; i < l; i++) {
    line = lines[i];

    var fileHeading = line.match(rFileHeading);
    var codeHeading = line.match(rCodeHeading);
    var codeEnd = line.match(rCodeEnd);
  }

  if (context !== ctx.DOCUMENT) {
    throw Error('Invalid document');
  }
};
