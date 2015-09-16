function convertToLines(text) {
  return text.split('\n');
}

function parseLine (line) {
  var headingMatch = line.match(/^\# ([\w\.\/ ]+)$/);
  var codeBlockMatch = line.match(/^\`\`\`([\-a-z0-9]+)$/);
  var codeBlockEndMatch = line.match(/^\`\`\`$/);

  if (headingMatch) {
    return {
      'type': 'heading',
      'data': headingMatch[1]
    };
  } else if (codeBlockMatch) {
    return {
      'type': 'codeStart',
      'data': codeBlockMatch[1]
    };
  } else if (codeBlockEndMatch) {
    return {
      'type': 'codeEnd',
      'data': null
    };
  } else {
    return {
      'type': 'data',
      'data': line
    };
  }
}