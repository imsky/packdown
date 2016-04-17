var rFileHeading = /^\#{1,6} \/([a-z0-9\.\,\_\-\(\)\/]+)$/i;
var rCodeHeading = /^```([a-z0-9][\-a-z0-9]*)$/i;
var rCodeEnd = /^```$/;

/**
 * Parse text into Packdown document
 * @param {String} input
 * @return Document object
 */
exports.line = function PackdownLineParser (input) {
  var document = {
    'files': {},
    'content': []
  };

  var text = String(input);
  var lines = text.split('\n');
  var line = lines[0];

  var stack = [];
  var file = null;

  for (var i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    file = null;

    var fileHeading = line.match(rFileHeading);
    var codeHeading = line.match(rCodeHeading);
    var codeEnd = line.match(rCodeEnd);
    var codeTag = codeHeading && codeHeading[1];

    if (fileHeading) {
      if (!stack.length) {
        file = {
          'name': fileHeading[1],
          'info': [],
          'content': [],
          'pending': true
        };
        document.files[file.name] = file;
        stack.push(file.name);
      } else {
        throw Error('File not finished parsing');
      }
    } else if (stack.length && (codeHeading || codeEnd)) {
      file = document.files[stack[0]];

      if (stack.length === 1) {
        file.tag = codeTag;
        stack.push(codeTag || 'txt');
      } else if (stack.length === 2 && !codeTag && file.pending) {
        delete file.pending;
        document.content.push({
          'file': file.name
        });
        stack = [];
      } else {
        throw Error('Invalid code block');
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
