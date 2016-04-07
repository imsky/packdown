var nearley = require('nearley');

var grammar = require('./grammar');

exports.nearley = function (input) {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

  parser.feed(input);

  return parser.results[0];
};

exports.line = function (input) {
  var rFileHeading = /^\#{1,6} \/([a-z0-9\.\,\_\-\(\)\/]+)$/i;
  var rCodeHeading = /^```([a-z0-9][\-a-z0-9]*)$/i;
  var rCodeEnd = /^```$/;

  var document = {
    'files': {},
    'content': []
  };

  var text = String(input);
  var lines = text.split('\n');
  var line = lines[0];


  var stack = [], file = null;

  for(var i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    file = null;

    var fileHeading = line.match(rFileHeading);
    var codeHeading = line.match(rCodeHeading);
    var codeEnd = line.match(rCodeEnd);
    var codeTag = codeHeading && codeHeading[1];

    if (fileHeading) {
      if (!stack.length) {
        file = {'name': fileHeading[1], 'info': [], 'content': []};
        document.files[file.name] = file;
        stack.push(file.name);
      } else {
        throw Error('File not finished parsing');
      }
    } else if (codeHeading || codeEnd) {
      if (stack.length === 1) {
        document.files[stack[0]].tag = codeTag;
        stack.push('CODE');
      } else if (stack.length === 2 && !codeTag) {
        document.content.push({'file': stack[0]});
        stack = [];
      } else {
        throw Error('Code block outside of file');
      }
    } else {
      if (stack.length === 1) {
        document.files[stack[0]].info.push(line);
      } else if (stack.length === 2) {
        document.files[stack[0]].content.push(line);
      } else {
        document.content.push(line);
      }
    }
  }

  if (stack.length) {
    throw Error('Invalid document');
  }

  return document;
};
