/** 
 * Packdown - files in Markdown
 * Version 0.9.99
 * © 2020 Ivan Malopinsky
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Packdown = factory());
}(this, (function () { 'use strict';

  var RE_FILE_HEADING = /^(#{1,6}) \/([a-z0-9.,_()/-]+)$/i;
  var RE_CODE_FENCE = /^```([a-z0-9][a-z0-9-]*)?$/i;
  var PACKDOWN_FILE_PREFIX = 'packdown:/';
  var NEWLINE = '\n';

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
      name: name,
      headingLevel: headingLevel,
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
    var isInputIndented = false;
    var isLastLineIndented = false;
    var indentedLineCount = 0;

    if (input.length > 1) {
      for (var i = 0; i < input.length; i++) {
        var line = input[i];
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
      return input.map(function (line) { return line.replace(/^ {4}/, ''); });
    }

    return input;
  }

  /**
   * Convert text input to Packdown document.
   * @param {string} input Packdown document as text
   * @returns {PackdownDocument} Packdown document
   */
  function read(input) {
    var text = String(input);

    if (text.slice(-1) !== NEWLINE) {
      text += NEWLINE;
    }

    var lines = text.split(NEWLINE);

    var pendingFiles = {};
    var document = PackdownDocument();

    var file = null;
    var source = null;

    for (var i = 0, list = lines; i < list.length; i += 1) {
      var line = list[i];

      var matchFileHeading = line.match(RE_FILE_HEADING);
      var matchCodeFence = line.match(RE_CODE_FENCE);

      if (matchFileHeading) {
        if (!file) {
          file = PackdownFile(matchFileHeading[2], matchFileHeading[1].length);
          document.files[file.name] = file;
          pendingFiles[file.name] = true;
        } else {
          throw Error('Unexpected file');
        }
      } else if (file && matchCodeFence) {
        var codeTag = matchCodeFence && matchCodeFence[1];

        if (!source) {
          file.infoString = codeTag;
          source = true;
        } else if (!codeTag && pendingFiles[file.name]) {
          delete pendingFiles[file.name];
          file.content = removeSourceIndentation(file.content);
          document.content.push(("" + PACKDOWN_FILE_PREFIX + (file.name)));
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
    var content = document.content;
    var files = document.files;

    if (!content || !files) {
      throw Error('Document content or files missing');
    } else if (!Array.isArray(content)) {
      throw Error('Document content not an array');
    } else if (Object(files) !== files) {
      throw Error('Document files not an object');
    }

    return content
      .map(function (line) {
        if (line.indexOf(PACKDOWN_FILE_PREFIX) === 0) {
          var filename = line.slice(PACKDOWN_FILE_PREFIX.length);
          var file = files[filename];
          var name = file.name;
          var headingLevel = file.headingLevel;
          var details = file.details;
          var infoString = file.infoString; if ( infoString === void 0 ) infoString = '';
          var content = file.content;
          var heading =
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
    var readFile = hostObject.readFile;
    var readDir = hostObject.readDir;
    var joinPath = hostObject.joinPath;
    var writeFile = hostObject.writeFile;

    if (!joinPath) {
      joinPath = function (a, b) { return (a + "/" + b); };
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

        var doc = read(f);
        var fileNames = Object.keys(doc.files);

        if (!fileNames.length) {
          return cb();
        }

        fileNames.forEach(function writeFileFromDocument(fileName, i) {
          var file = doc.files[fileName];
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
      function packFilesToDocument(files, doc) {
        var done = false;
        files.forEach(function writeFileToDocument(fileName, i) {
          if (done) {
            return;
          }
          readFile(joinPath(src, fileName), function checkProgress(err, data) {
            if (err) {
              done = true;
              return cb(err);
            }

            var existingFile = doc.files[fileName];
            var file = existingFile || PackdownFile(fileName, null);
            file.content = data.split(NEWLINE);
            doc.files[fileName] = file;

            if (!existingFile) {
              doc.content.push(("" + PACKDOWN_FILE_PREFIX + fileName));
            }

            if (i === files.length - 1) {
              writeFile(dst, write(doc), cb);
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

        var doc = PackdownDocument();

        var mergeFiles = files
          .map(function (f) { return f.toLowerCase(); })
          .filter(function (f) { return f === 'index.md' || f === 'readme.md'; });
        var mergeFile =
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

            var mergeDoc = read(f);
            var filesToPack = files;

            if (Object.keys(mergeDoc.files).length) {
              doc = mergeDoc;
              filesToPack = files.filter(function (f) { return f !== mergeFile; });
            }

            packFilesToDocument(filesToPack, doc);
          });
        } else {
          packFilesToDocument(files, doc);
        }
      });
    }

    return Object.freeze({ unpack: unpack, pack: pack });
  }

  var index = {
    read: read,
    write: write,
    commandFactory: commandFactory,
    version: '0.9.99'
  };

  return index;

})));
