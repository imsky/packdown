var example = [
'# Example Packdown File',
'## example.js',
'```js',
'console.log("Hello world!");',
'```'
].join('\n');

function convertToLines(text) {
  return text.split('\n');
}

function parseLine (line) {
  var headingMatch = line.match(/^\# ([\w\.\/ ]+)$/);
  var fileMatch = line.match(/^\#\# ([\w\.\/ ]+)$/);
  var codeBlockMatch = line.match(/^\`\`\`([\-a-z0-9]+)$/);
  var codeBlockEndMatch = line.match(/^\`\`\`$/);

  if (headingMatch) {
    return {
      'type': 'heading',
      'data': headingMatch[1]
    };
  } else if (fileMatch) {
    //todo: rename to buffer
    return {
      'type': 'file',
      'data': fileMatch[1]
    };
  }else if (codeBlockMatch) {
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

//todo: rewrite in PEG or another format
function parseDoc (doc) {
  var output = [];
  var lines = convertToLines(doc);

  var docStack = [];
  var fileStack = [];
  var buffer = [];

  for(var i = 0; i < lines.length; i++) {
    var line = parseLine(lines[i]);
    switch(line.type) {
      case 'heading':
        if (!docStack.length) {
          docStack.push(line);
        } else {
          throw Error('New document added before closing current document');
        }
      break;
      case 'file':
        if (!fileStack.length) {
          fileStack.push(line);
        } else {
          throw Error('New file added before closing current file');
        }
      break;
      case 'codeStart':
        if (fileStack.slice(-1)[0].type === 'file') {
          fileStack.push(line);
          buffer = [];
        } else {
          throw Error('Code block can not be added if not within file');
        }
      break;
      case 'codeEnd': 
        if (fileStack.slice(-1)[0].type === 'codeStart') {
          var line = fileStack.pop();
          var language = line.data;
          line = fileStack.pop();
          var name = line.data;

          //todo: rename to buffer
          fileStack.push({
            'type': 'buffer',
            'data': buffer,
            'language': language,
            'name': name
          });
        } else {
          throw Error('Code block ended without corresponding start');
        }
      break;
      default:
        buffer.push(line.data);
      break;
    }
  }
}

parseDoc(example);