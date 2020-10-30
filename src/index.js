const RE_FILE_HEADING = /^(#{1,6}) \/([a-z0-9.,_()/-]+)$/i;
const RE_CODE_FENCE = /^```([a-z0-9][a-z0-9-]*)?$/i;
const PACKDOWN_FILE_PREFIX = 'packdown:/';

/**
 * @typedef {Object} PackdownFile
 * @property {string} name
 * @property {number} headingLevel heading level of the file block
 * @property {string[]} details details about the file
 * @property {string} infoString typically specifies the language of the file's content; may be used for hints and file metadata
 * @property {string[]} content file content
 */

/**
 * @param {string} name File name
 * @param {number} headingLevel Heading level of the file block
 * @returns {PackdownFile} Packdown file
 */
function PackdownFile(name, headingLevel) {
  return {
    name,
    headingLevel,
    details: [],
    infoString: undefined,
    content: []
  };
}

/**
 * @typedef {Object} PackdownDocument
 * @property {Object.<string,PackdownFile>} files
 * @property {string[]} content
 */

/**
 * @returns {PackdownDocument} Packdown document
 */
function PackdownDocument() {
  return {
    files: {},
    content: []
  };
}

/**
 * Does line start with 4 spaces?
 * @param {string} line Line of text
 * @return {Boolean} True if line starts with 4 spaces
 */
function isLineIndented(line) {
  return line.slice(0, 4) === '    ';
}

/**
 * Strip indentation (leading 4 spaces) from input if it seems to be indented.
 * @param {string[]} input Array of lines of text
 * @returns {string[]} Array of lines of text without indentation if it exists
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
 * @param {string} input Packdown document as text
 * @returns {PackdownDocument} Packdown document
 */
function read(input) {
  let text = String(input);

  if (text.slice(-1) !== '\n') {
    text += '\n';
  }

  const lines = text.split('\n');

  const pendingFiles = {};
  const document = PackdownDocument();

  let file = null;
  let source = null;

  for (const line of lines) {
    const matchFileHeading = line.match(RE_FILE_HEADING);
    const matchCodeFence = line.match(RE_CODE_FENCE);

    if (matchFileHeading) {
      if (!file) {
        file = PackdownFile(matchFileHeading[2], matchFileHeading[1].length);
        document.files[file.name] = file;
        pendingFiles[file.name] = true;
      } else {
        throw Error('Unexpected file');
      }
    } else if (file && matchCodeFence) {
      const codeTag = matchCodeFence && matchCodeFence[1];

      if (!source) {
        file.infoString = codeTag;
        source = true;
      } else if (!codeTag && pendingFiles[file.name]) {
        delete pendingFiles[file.name];
        file.content = removeSourceIndentation(file.content);
        document.content.push(`${PACKDOWN_FILE_PREFIX}${file.name}`);
        file = null;
        source = null;
      } else {
        throw Error('Invalid code block');
      }
    } else {
      if (file && !source) {
        file.details.push(line);
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

/**
 * Convert Packdown document to text.
 * @param {PackdownDocument} document Packdown document
 * @returns {string} Packdown document as text
 */
function write(document) {
  const { content, files } = document;

  if (!content || !files) {
    throw Error('Document content or files missing');
  } else if (!Array.isArray(content)) {
    throw Error('Document content not an array');
  } else if (Object(files) !== files) {
    throw Error('Document files not an object');
  }

  return content
    .map(line => {
      if (line.indexOf(PACKDOWN_FILE_PREFIX) === 0) {
        const file = files[line.slice(PACKDOWN_FILE_PREFIX.length)];
        const { name, headingLevel, details, infoString = '', content } = file;
        const heading =
          Array(Math.max(2, (headingLevel || 1) + 1)).join('#') + ' /' + name;
        return [
          heading,
          details.join('\n'),
          '```' + infoString,
          content.join('\n'),
          '```'
        ].join('\n');
      }
      return line;
    })
    .join('\n');
}

export default {
  read,
  write,
  version: 'VERSION'
};
