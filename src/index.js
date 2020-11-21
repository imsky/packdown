const RE_FILE_HEADING = /^(#{1,6}) \/([a-z0-9.,_()/-]+)$/i;
const RE_CODE_FENCE = /^```([a-z0-9][a-z0-9-]*)?$/i;
const PACKDOWN_FILE_PREFIX = 'packdown:/';
const NEWLINE = '\n';

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

  if (text.slice(-1) !== NEWLINE) {
    text += NEWLINE;
  }

  const lines = text.split(NEWLINE);

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
        const filename = line.slice(PACKDOWN_FILE_PREFIX.length);
        const file = files[filename];
        const { name, headingLevel, details, infoString = '', content } = file;
        const heading =
          Array(Math.max(2, (headingLevel || 1) + 1)).join('#') + ' /' + name;
        return [
          heading,
          details.join(NEWLINE),
          '```' + infoString,
          content.join(NEWLINE),
          '```'
        ].join(NEWLINE);
      }
      return line;
    })
    .join(NEWLINE);
}

/**
 * @typedef {Object} PackdownCommandHostObject
 * @property {function} readFile Node-style callback function that takes a path and returns the contents of the file at the path
 * @property {function} readDir Node-style callback function that takes a path and returns an array of files in the directory at the path
 * @property {function} joinPath A function that joins two path segments together, e.g. a + b = a/b
 * @property {function} writeFile Node-style callback function that takes a path and data and writes the data to a file at the path
 */

/**
 * @typedef {Object} PackdownCommandInterface
 * @property {function} pack Node-style callback function that takes a source path and a destination path and combines files from the directory at the source path into a Packdown document written to a file at the destination path
 * @property {function} unpack Node-style callback function that takes source path and a destination path and extracts files from the Packdown document at the source path to the directory at the destination path
 */

/**
 * Provide command interface for packing and unpacking documents.
 * @param {PackdownCommandHostObject} hostObject an object that provides readFile, readDir, joinPath, and writeFile functions
 * @returns {PackdownCommandInterface} Packdown command interface
 */
function commandFactory(hostObject) {
  let { readFile, readDir, joinPath, writeFile } = hostObject;

  if (!joinPath) {
    joinPath = (a, b) => `${a}/${b}`;
  }

  /**
   * Extract files from a Packdown document and write them to storage.
   *
   * This function assumes the `src` file does not exist and the `dst`
   * directory exists.
   * @param {string} src Packdown document (e.g. example.md)
   * @param {string} dst Directory where files from Packdown document should be extracted
   * @param {function} cb Node-style callback function called when unpacking is done or there's an error
   * @returns {void}
   */
  function unpack(src, dst, cb) {
    readFile(src, function unpackDocument(err, f) {
      if (err) {
        return cb(err);
      }

      const doc = read(f);
      const fileNames = Object.keys(doc.files);

      if (!fileNames.length) {
        return cb();
      }

      fileNames.forEach(function writeFileFromDocument(fileName, i) {
        const file = doc.files[fileName];
        writeFile(
          joinPath(dst, file.name),
          file.content.join(NEWLINE),
          function checkProgress(err) {
            if (err) {
              return cb(err);
            } else if (i === fileNames.length - 1) {
              return cb();
            }
          }
        );
      });
    });
  }

  /**
   * Combine files into a Packdown document and write it to storage.
   *
   * If there's a "merge document", a Packdown document with files,
   * named README.md or index.md (index.md taking precedence) in the
   * source directory ("src"), it'll be updated and used as the output.
   *
   * This function assumes the `src` directory exists and the `dst`
   * file does not exist.
   * @param {string} src Directory containing files
   * @param {string} dst Packdown document (e.g. example.md)
   * @param {function} cb Node-style callback function called when packing is done or there's an error
   * @returns {void}
   */
  function pack(src, dst, cb) {
    function packFilesToDocument(files, document) {
      let done = false;
      files.forEach(function writeFileToDocument(fileName, i) {
        if (done) {
          return;
        }
        readFile(joinPath(src, fileName), function checkProgress(err, data) {
          if (err) {
            done = true;
            return cb(err);
          }

          const existingFile = document.files[fileName];
          const file = existingFile || PackdownFile(fileName, null);
          file.content = data.split(NEWLINE);
          document.files[fileName] = file;

          if (!existingFile) {
            document.content.push(`${PACKDOWN_FILE_PREFIX}${fileName}`);
          }

          if (i === files.length - 1) {
            writeFile(dst, write(document), cb);
          }
        });
      });
    }

    readDir(src, function packFiles(err, files) {
      if (err) {
        return cb(err);
      } else if (!Array.isArray(files)) {
        return cb('Files not an array');
      }

      if (!files.length) {
        return cb();
      }

      let document = PackdownDocument();

      const mergeFiles = files
        .map(f => f.toLowerCase())
        .filter(f => f === 'index.md' || f === 'readme.md');
      const mergeFile =
        mergeFiles.indexOf('index.md') !== -1
          ? 'index.md'
          : files.indexOf('readme.md') !== -1
          ? 'readme.md'
          : null;

      if (mergeFile) {
        readFile(joinPath(src, mergeFile), function checkIfMergeFileIsPackdown(
          err,
          f
        ) {
          if (err) {
            return cb(err);
          }

          const mergeDoc = read(f);
          let filesToPack = files;

          if (Object.keys(mergeDoc.files).length) {
            document = mergeDoc;
            filesToPack = files.filter(f => f !== mergeFile);
          }

          packFilesToDocument(filesToPack, document);
        });
      } else {
        packFilesToDocument(files, document);
      }
    });
  }

  return Object.freeze({ unpack, pack });
}

export default {
  read,
  write,
  commandFactory,
  version: 'VERSION'
};
