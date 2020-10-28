const RE_FILE_HEADING = /^#{1,6} \/([a-z0-9.,_()/-]+)$/i;
const RE_CODE_HEADING = /^```([a-z0-9][a-z0-9-]*)$/i;
const RE_CODE_END = /^```$/;

/**
 * Does line start with 4 spaces?
 * @param {string} line
 * @return Boolean
 */
function isLineIndented (line) {
  return line.slice(0, 4) === '    ';
}

/**
 * Strip indent (leading 4 spaces) from input if it seems to be indented.
 * @param {string[]} input
 * @returns {string[]}
 */
function removeSourceIndentation(input) {
  let isInputIndented = false;
  let isLastLineIndented = false;
  let indentedLineCount = 0;

  if (input.length > 1) {
    for (let i = 0; i < input.length; i++) {
      const line = input[i];
      if (!line.length) {
        continue;
      }

      isLastLineIndented = isLineIndented(line);

      if (isLastLineIndented) {
        indentedLineCount++;
        if (indentedLineCount > 1) {
          isInputIndented = true;
          break;
        }
      } else if (i === 0) {
        isInputIndented = false;
        break;
      }
    }
  } else if (input.length === 1 && isLineIndented(input[0])) {
    isInputIndented = true;
  }

  if (isInputIndented) {
    return input.map(line => line.replace(/^ {4}/, ''));
  }

  return input;
}

/**
 * Convert text input to Packdown document.
 * @param {string} input
 */
function read(input) {
  let text = String(input);

  if (text.slice(-1) !== '\n') {
    text += '\n';
  }

  const lines = text.split('\n');

  const document = {
    files: {},
    content: []
  };

  let file = null;
  let source = null;

  for (const line of lines) {
    const matchFileHeading = line.match(RE_FILE_HEADING);
    const matchCodeHeading = line.match(RE_CODE_HEADING);
    const matchCodeEnd = line.match(RE_CODE_END);

    if (matchFileHeading) {
      if (!file) {
        file = {
          name: matchFileHeading[1],
          info: [],
          tag: null,
          content: [],
          pending: true
        };

        document.files[file.name] = file;
      } else {
        throw Error('Unexpected file');
      }
    } else if (file && (matchCodeHeading || matchCodeEnd)) {
      const codeTag = matchCodeHeading && matchCodeHeading[1];

      if (!source) {
        file.tag = codeTag;
        source = codeTag || 'code';
      } else if (!codeTag && file.pending) {
        delete file.pending;
        file.content = removeSourceIndentation(file.content);
        document.content.push({ file: file.name });
        file = null;
        source = null;
      } else {
        throw Error('Invalid code block');
      }
    } else {
      if (file && !source) {
        file.info.push(line);
      } else if (file && source) {
        file.content.push(line);
      } else {
        document.content.push(line);
      }
    }
  }

  if (file || source) {
    throw Error('Truncated input');
  }

  return document;
}

export default {
  read,
  version: 'VERSION'
}
