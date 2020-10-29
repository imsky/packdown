/** 
 * Packdown - files in Markdown
 * Version 0.9.9
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

    if (text.slice(-1) !== '\n') {
      text += '\n';
    }

    var lines = text.split('\n');

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
          var file = files[line.slice(PACKDOWN_FILE_PREFIX.length)];
          var name = file.name;
          var headingLevel = file.headingLevel;
          var details = file.details;
          var infoString = file.infoString; if ( infoString === void 0 ) infoString = '';
          var content = file.content;
          var heading =
            Array(Math.max(2, headingLevel + 1)).join('#') + ' /' + name;
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

  var index = {
    read: read,
    write: write,
    version: '0.9.9'
  };

  return index;

})));
