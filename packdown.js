/*!

Packdown - Markdown-based file container format
Version 0.7.0
(c) 2015-2016 Ivan Malopinsky - http://imsky.co

License: MIT
Issues:  https://github.com/imsky/packdown/issues

*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Packdown = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var version = require('./lib/version');

var writer = require('./lib/writer');
var reader = require('./lib/reader');
var add = require('./lib/add');
var remove = require('./lib/remove');
var filesToDoc = require('./lib/files-to-doc');

exports.write = function (document) {
  //todo: validate document object
  return writer(document);
};

exports.read = reader;

exports.add = add;

exports.remove = remove;

exports.filesToDoc = filesToDoc;

exports.version = version;

},{"./lib/add":2,"./lib/files-to-doc":4,"./lib/reader":6,"./lib/remove":7,"./lib/version":8,"./lib/writer":9}],2:[function(require,module,exports){
module.exports = function (document, file) {
  var oldFile = null;

  document.files.forEach(function (_file, index) {
    if (_file.name === file.name) {
      oldFile = _file;
      document.files[index] = file;
    }
  });

  if (!oldFile) {
    document.files.push(file);
  }

  return oldFile;
};
},{}],3:[function(require,module,exports){
exports.FOUR_SPACES = '    ';
},{}],4:[function(require,module,exports){
var normalizePath = require('normalize-path');

/*
@param root Root directory
@param files An array of file objects with at least a path and a content property
*/
module.exports = function (root, files) {
  var document = {
    'name': 'Untitled'
  };

  var basePath = normalizePath(root);

  document.files = files.map(function (file) {
    var ext = file.ext || '';
    var content = file.content;
    var path = file.path;

    if (!content || !content.length) {
      throw Error('Missing file content');
    } else if (!path || !path.length) {
      throw Error('Missing file path');
    } else if (path.length > 256) {
      throw Error('File path is too long');
    }

    var filePath = normalizePath(file.path).slice(basePath.length + 1);
    var extRe = /\.[0-9a-z]+$/i;

    if (!ext && filePath.indexOf('.') !== -1) {
      var extMatch = filePath.match(extRe);

      if (extMatch) {
        ext = extMatch[0];
      }
    }

    var pathWords = filePath.replace(/\W+/g, '');

    if (!pathWords.length) {
      throw Error('Invalid path: ' + filePath);
    }

    var tag = ext;

    if (tag[0] === '.') {
      tag = tag.slice(1);
    }

    return {
      'name': filePath,
      'tag': tag,
      'content': content
    };
  });

  return document;
};
},{"normalize-path":11}],5:[function(require,module,exports){
// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
  function id (x) {
    return x[0];
  }
  function NULL () {
    return null;
  }
  function JOIN (d) {
    return d.join('');
  }
  function IDJOIN (d) {
    return d[0].join('');
  }
  var grammar = {
    ParserRules: [
      {
        "name": "Document",
        "symbols": ["DocHeader", "DocInfo", "FileList"],
        "postprocess": function (d) {
          return {
            'name': d[0],
            'info': d[1],
            'files': d[2]
          };
        }
      },
      {
        "name": "DocHeader$string$1",
        "symbols": [{
          "literal": "#"
        }, {
          "literal": " "
        }],
        "postprocess": function joiner (d) {
          return d.join('');
        }
      },
      {
        "name": "DocHeader",
        "symbols": ["DocHeader$string$1", "HeadingText", {
          "literal": "\n"
        }],
        "postprocess": function (d) {
          return d[1];
        }
      },
      {
        "name": "DocInfo",
        "symbols": ["DocSafeBlock"],
        "postprocess": id
      },
      {
        "name": "FileList",
        "symbols": ["FileList$ebnf$1"],
        "postprocess": id
      },
      {
        "name": "FileBlock",
        "symbols": ["FileHeader", "FileInfo", "CodeBlock", "NL"],
        "postprocess": function (d) {
          var data = d[2];
          var retval = {
            'name': d[0],
            'info': d[1],
            'tag': data.tag,
            'content': data.content
          };
          data = null;
          return retval;
        }
      },
      {
        "name": "FileHeader$string$1",
        "symbols": [{
          "literal": " "
        }, {
          "literal": "/"
        }],
        "postprocess": function joiner (d) {
          return d.join('');
        }
      },
      {
        "name": "FileHeader",
        "symbols": ["ATXHeader", "FileHeader$string$1", "PathText", {
          "literal": "\n"
        }],
        "postprocess": function (d) {
          return d[2];
        }
      },
      {
        "name": "FileInfo",
        "symbols": ["SafeBlock"],
        "postprocess": function (d) {
          var data = d[0];
          if (!data.length) {
            return null;
          }
          if (data.length === 1 && data[0] === '') {
            return null;
          }
          return data;
        }
      },
      {
        "name": "CodeBlock$string$1",
        "symbols": [{
          "literal": "`"
        }, {
          "literal": "`"
        }, {
          "literal": "`"
        }],
        "postprocess": function joiner (d) {
          return d.join('');
        }
      },
      {
        "name": "CodeBlock",
        "symbols": ["CodeBlockStart", "SafeBlock", "CodeBlock$string$1", {
          "literal": "\n"
        }],
        "postprocess": function (d) {
          return {
            'tag': d[0],
            'content': d[1]
          };
        }
      },
      {
        "name": "CodeBlockStart$string$1",
        "symbols": [{
          "literal": "`"
        }, {
          "literal": "`"
        }, {
          "literal": "`"
        }],
        "postprocess": function joiner (d) {
          return d.join('');
        }
      },
      {
        "name": "CodeBlockStart",
        "symbols": ["CodeBlockStart$string$1", "CodeBlockStart$ebnf$1", {
          "literal": "\n"
        }],
        "postprocess": function (d) {
          return d[1];
        }
      },
      {
        "name": "CodeBlockTag",
        "symbols": [/[a-z0-9]/, "CodeBlockTag$ebnf$1"],
        "postprocess": function (d) {
          return d[0] + d[1].join('');
        }
      },
      {
        "name": "SafeBlock",
        "symbols": ["SafeBlock$ebnf$1"],
        "postprocess": id
      },
      {
        "name": "SafeLine",
        "symbols": ["SafeLine$ebnf$1", {
          "literal": "\n"
        }],
        "postprocess": function (d, l, reject) {
          var line = d[0].join('');
          if (line.indexOf('```') === 0) {
            return reject;
          }
          return line;
        }
      },
      {
        "name": "DocSafeBlock",
        "symbols": ["DocSafeBlock$ebnf$1"],
        "postprocess": id
      },
      {
        "name": "DocSafeLine",
        "symbols": ["DocSafeLine$ebnf$1", {
          "literal": "\n"
        }],
        "postprocess": function (d, l, reject) {
          var line = d[0].join('');
          if (line[0] === '#' && line.match(/^#{2,} \//)) {
            return reject;
          }
          return line;
        }
      },
      {
        "name": "HeadingText",
        "symbols": ["HeadingText$ebnf$1"],
        "postprocess": IDJOIN
      },
      {
        "name": "PathText",
        "symbols": ["PathText$ebnf$1"],
        "postprocess": IDJOIN
      },
      {
        "name": "SemVer",
        "symbols": ["int", {
          "literal": "."
        }, "int", {
          "literal": "."
        }, "int"],
        "postprocess": JOIN
      },
      {
        "name": "ATXHeader",
        "symbols": ["ATXHeader$ebnf$1"],
        "postprocess": function (d, l, reject) {
          var line = d[0].join('');
          if (line.length > 6) {
            return reject;
          }
          return line;
        }
      },
      {
        "name": "int",
        "symbols": ["int$ebnf$1"],
        "postprocess": IDJOIN
      },
      {
        "name": "NL",
        "symbols": ["NL$ebnf$1"],
        "postprocess": function () {
          return "\n";
        }
      },
      {
        "name": "_",
        "symbols": [],
        "postprocess": NULL
      },
      {
        "name": "_",
        "symbols": [/[\s]/, "_"],
        "postprocess": NULL
      },
      {
        "name": "FileList$ebnf$1",
        "symbols": ["FileBlock"]
      },
      {
        "name": "FileList$ebnf$1",
        "symbols": ["FileBlock", "FileList$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "CodeBlockStart$ebnf$1",
        "symbols": ["CodeBlockTag"],
        "postprocess": id
      },
      {
        "name": "CodeBlockStart$ebnf$1",
        "symbols": [],
        "postprocess": function (d) {
          return null;
        }
      },
      {
        "name": "CodeBlockTag$ebnf$1",
        "symbols": [/[\-a-z0-9]/]
      },
      {
        "name": "CodeBlockTag$ebnf$1",
        "symbols": [/[\-a-z0-9]/, "CodeBlockTag$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "SafeBlock$ebnf$1",
        "symbols": []
      },
      {
        "name": "SafeBlock$ebnf$1",
        "symbols": ["SafeLine", "SafeBlock$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "SafeLine$ebnf$1",
        "symbols": []
      },
      {
        "name": "SafeLine$ebnf$1",
        "symbols": [/./, "SafeLine$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "DocSafeBlock$ebnf$1",
        "symbols": []
      },
      {
        "name": "DocSafeBlock$ebnf$1",
        "symbols": ["DocSafeLine", "DocSafeBlock$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "DocSafeLine$ebnf$1",
        "symbols": []
      },
      {
        "name": "DocSafeLine$ebnf$1",
        "symbols": [/./, "DocSafeLine$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "HeadingText$ebnf$1",
        "symbols": [/[^\n]/]
      },
      {
        "name": "HeadingText$ebnf$1",
        "symbols": [/[^\n]/, "HeadingText$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "PathText$ebnf$1",
        "symbols": [/[a-z0-9\.\-\/]/]
      },
      {
        "name": "PathText$ebnf$1",
        "symbols": [/[a-z0-9\.\-\/]/, "PathText$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "ATXHeader$ebnf$1",
        "symbols": [{
          "literal": "#"
        }]
      },
      {
        "name": "ATXHeader$ebnf$1",
        "symbols": [{
          "literal": "#"
        }, "ATXHeader$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "int$ebnf$1",
        "symbols": [/[0-9]/]
      },
      {
        "name": "int$ebnf$1",
        "symbols": [/[0-9]/, "int$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      },
      {
        "name": "NL$ebnf$1",
        "symbols": []
      },
      {
        "name": "NL$ebnf$1",
        "symbols": [{
          "literal": "\n"
        }, "NL$ebnf$1"],
        "postprocess": function arrconcat (d) {
          return [d[0]].concat(d[1]);
        }
      }
    ],
    ParserStart: "Document"
  }
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = grammar;
  } else {
    window.grammar = grammar;
  }
})();

},{}],6:[function(require,module,exports){
var nearley = require('nearley');

var grammar = require('./grammar');

var FOUR_SPACES = require('./constants').FOUR_SPACES;

function isSpaceEncoded (line) {
  return line.slice(0, 4) === FOUR_SPACES;
}

module.exports = function (input, options) {
  options = options || {};

  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

  if (input.slice(-1) !== '\n') {
    input += '\n';
  }

  try {
    parser.feed(input);
  } catch ( e ) {
    throw Error('Failed to parse document');
  }

  var document = parser.results[0];

  document.files.forEach(function (file) {
    var spaceEncoding = false;
    var spaceEncodedLines = 0;
    var lastLineSpaceEncoded = false;

    if (options.disableSpaceEncoding) {
      return document;
    }

    if (file.content.length > 1) {
      // if two consecutive lines (ignoring empty lines) are space encoded, then the file is treated as space encoded
      for (var i = 0; i < file.content.length; i++) {
        if (!file.content[i].length) {
          continue;
        }

        lastLineSpaceEncoded = isSpaceEncoded(file.content[i]);

        if (lastLineSpaceEncoded) {
          spaceEncodedLines++;
          if (spaceEncodedLines > 1) {
            spaceEncoding = true;
            break;
          }
        } else {
          if (i === 0 || lastLineSpaceEncoded) {
            spaceEncoding = false;
            break;
          }
        }
      }
    } else if (file.content.length === 1 && isSpaceEncoded(file.content[0])) {
      spaceEncoding = true;
    }

    if (spaceEncoding) {
      file.content = file.content.map(function (line) {
        return line.replace(/^    /, '');
      });
    }
  });

  return document;
};
},{"./constants":3,"./grammar":5,"nearley":10}],7:[function(require,module,exports){
module.exports = function (document, path) {
  var oldFile = null;

  document.files.forEach(function (file, index) {
    if (file.name === path) {
      oldFile = file;
      document.files[index] = null;
    }
  });

  if (oldFile) {
    document.files = document.files.filter(Boolean);
  }

  return oldFile;
};
},{}],8:[function(require,module,exports){
var version = require('../packdown-version');

module.exports = {
  'package': version.package,
  'format': version.format
};
},{"../packdown-version":12}],9:[function(require,module,exports){
var version = require('./version');

var FOUR_SPACES = require('./constants').FOUR_SPACES;

function DocHeader (document) {
  var ret = [];

  var name = document.name;
  var info = document.info || '';

  if (!name) {
    throw Error('Document name is missing');
  }

  var DocHeader = '# ' + name;

  ret.push(DocHeader);

  if (info) {
    ret.push(info);
  }

  return ret.join('\n');
}

function FileBlock (file) {
  var ret = [];

  var name = file.name;
  var info = file.info || '';
  var tag = file.tag || '';
  var content = file.content || '';
  var encoding = file.encoding || 'space';

  if (!name) {
    throw Error('File name is missing');
  }

  if (name.match(/\s/)) {
    throw Error('File name contains spaces');
  }

  var FileHeader = '### /' + name;

  ret.push(FileHeader);

  if (info) {
    ret.push(info);
  }

  var CodeBlockStart = '```' + tag;

  var encodedContent = content;

  if (typeof encodedContent === 'string') {
    encodedContent = content.split('\n');
  } else if (!Array.isArray(encodedContent)) {
    throw Error('File content is neither an array nor a string');
  }

  switch (encoding) {
    case 'space':
      encodedContent = encodedContent.map(function (line) {
        return FOUR_SPACES + line;
      })
        .join('\n');
      break;
  }

  ret.push(CodeBlockStart, encodedContent, '```');

  return ret.join('\n');
}

module.exports = function (document) {
  if (!Array.isArray(document.files)) {
    throw Error('File list is not an array');
  }

  if (!document.files.length) {
    throw Error('File list is empty');
  }

  var FileList = document.files.map(FileBlock);

  var Document = [
    DocHeader(document),
    FileList.join('\n\n')
  ];

  return Document.join('\n\n') + '\n';
};

},{"./constants":3,"./version":8}],10:[function(require,module,exports){
(function () {
function Rule(name, symbols, postprocess) {
    this.name = name;
    this.symbols = symbols;        // a list of literal | regex class | nonterminal
    this.postprocess = postprocess;
    return this;
}

Rule.prototype.toString = function(withCursorAt) {
    function stringifySymbolSequence (e) {
        return (e.literal) ? JSON.stringify(e.literal)
                           : e.toString();
    }
    var symbolSequence = (typeof withCursorAt === "undefined")
                         ? this.symbols.map(stringifySymbolSequence).join(' ')
                         : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                             + " ● "
                             + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
    return this.name + " → " + symbolSequence;
}


// a State is a rule at a position from a given starting point in the input stream (reference)
function State(rule, expect, reference) {
    this.rule = rule;
    this.expect = expect;
    this.reference = reference;
    this.data = [];
}

State.prototype.toString = function() {
    return "{" + this.rule.toString(this.expect) + "}, from: " + (this.reference || 0);
};

State.prototype.nextState = function(data) {
    var state = new State(this.rule, this.expect + 1, this.reference);
    state.data = this.data.slice(0);  // make a cheap copy of currentState's data
    state.data.push(data);            // append the passed data
    return state;
};

State.prototype.consumeTerminal = function(inp) {
    var val = false;
    if (this.rule.symbols[this.expect]) {                  // is there a symbol to test?
       if (this.rule.symbols[this.expect].test) {          // is the symbol a regex?
          if (this.rule.symbols[this.expect].test(inp)) {  // does the regex match
             val = this.nextState(inp);  // nextState on a successful regex match
          }
       } else {   // not a regex, must be a literal
          if (this.rule.symbols[this.expect].literal === inp) {
             val = this.nextState(inp);  // nextState on a successful literal match
          }
       }
    }
    return val;
};

State.prototype.consumeNonTerminal = function(inp) {
    if (this.rule.symbols[this.expect] === inp) {
        return this.nextState(inp);
    }
    return false;
};

State.prototype.process = function(location, table, rules, addedRules) {
    if (this.expect === this.rule.symbols.length) {
        // I have completed a rule
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
        if (!(this.data === Parser.fail)) {
            var w = 0;
            // We need a while here because the empty rule will
            // modify table[reference]. (when location === reference)
            var s,x;
            while (w < table[this.reference].length) {
                s = table[this.reference][w];
                x = s.consumeNonTerminal(this.rule.name);
                if (x) {
                    x.data[x.data.length-1] = this.data;
                    table[location].push(x);
                }
                w++;
            }

            // --- The comment below is OUTDATED. It's left so that future
            // editors know not to try and do that.

            // Remove this rule from "addedRules" so that another one can be
            // added if some future added rule requires it.
            // Note: I can be optimized by someone clever and not-lazy. Somehow
            // queue rules so that everything that this completion "spawns" can
            // affect the rest of the rules yet-to-be-added-to-the-table.
            // Maybe.

            // I repeat, this is a *bad* idea.

            // var i = addedRules.indexOf(this.rule);
            // if (i !== -1) {
            //     addedRules.splice(i, 1);
            // }
        }
    } else {
        // In case I missed an older nullable's sweep, update yourself. See
        // above context for why this makes sense.

        var ind = table[location].indexOf(this);
        for (var i=0; i<ind; i++) {
            var state = table[location][i];
            if (state.rule.symbols.length === state.expect && state.reference === location) {
                var x = this.consumeNonTerminal(state.rule.name);
                if (x) {
                    x.data[x.data.length-1] = state.data;
                    table[location].push(x);
                }
            }
        }

        // I'm not done, but I can predict something
        var exp = this.rule.symbols[this.expect];

        // for each rule
        var me = this;
        rules.forEach(function(r) {
            // if I expect it, and it hasn't been added already
            if (r.name === exp && addedRules.indexOf(r) === -1) {
                // Make a note that you've added it already, and don't need to
                // add it again; otherwise left recursive rules are going to go
                // into an infinite loop by adding themselves over and over
                // again.

                // If it's the null rule, however, you don't do this because it
                // affects the current table row, so you might need it to be
                // called again later. Instead, I just insert a copy whose
                // state has been advanced one position (since that's all the
                // null rule means anyway)

                if (r.symbols.length > 0) {
                    addedRules.push(r);
                    table[location].push(new State(r, 0, location));
                } else {
                    // Empty rule
                    // This is special
                    var copy = me.consumeNonTerminal(r.name);
                    if (r.postprocess) {
                        copy.data[copy.data.length-1] = r.postprocess([], this.reference);
                    } else {
                        copy.data[copy.data.length-1] = [];
                    }
                    table[location].push(copy);
                }
            }
        });
    }
};



function Parser(rules, start) {
    var table = this.table = [];
    this.rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
    this.start = start = start || this.rules[0].name;
    // Setup a table
    var addedRules = [];
    this.table.push([]);
    // I could be expecting anything.
    this.rules.forEach(function (r) {
        if (r.name === start) {  // add all rules named start
            addedRules.push(r);
            table[0].push(new State(r, 0, 0));
        }});  // this should refer to this object, not each rule inside the forEach
    this.advanceTo(0, addedRules);
    this.current = 0;
}

// create a reserved token for indicating a parse fail
Parser.fail = {};

Parser.prototype.advanceTo = function(n, addedRules) {
    // Advance a table, take the closure of .process for location n in the input stream
    var w = 0;
    while (w < this.table[n].length) {
        (this.table[n][w]).process(n, this.table, this.rules, addedRules);
        w++;
    }
}

Parser.prototype.feed = function(chunk) {
    for (var chunkPos = 0; chunkPos < chunk.length; chunkPos++) {
        // We add new states to table[current+1]
        this.table.push([]);

        // Advance all tokens that expect the symbol
        // So for each state in the previous row,

        for (var w = 0; w < this.table[this.current + chunkPos].length; w++) {
            var s = this.table[this.current + chunkPos][w];
            var x = s.consumeTerminal(chunk[chunkPos]);      // Try to consume the token
            if (x) {
                // And then add it
                this.table[this.current + chunkPos + 1].push(x);
            }
        }

        // Next, for each of the rules, we either
        // (a) complete it, and try to see if the reference row expected that
        //     rule
        // (b) predict the next nonterminal it expects by adding that
        //     nonterminal's start state
        // To prevent duplication, we also keep track of rules we have already
        // added

        var addedRules = [];
        this.advanceTo(this.current + chunkPos + 1, addedRules);

        // If needed, throw an error:
        if (this.table[this.table.length-1].length === 0) {
            // No states at all! This is not good.
            var err = new Error(
                "nearley: No possible parsings (@" + (this.current + chunkPos)
                    + ": '" + chunk[chunkPos] + "')."
            );
            err.offset = this.current + chunkPos;
            throw err;
        }
    }

    this.current += chunkPos;
    // Incrementally keep track of results
    this.results = this.finish();

    // Allow chaining, for whatever it's worth
    return this;
};

Parser.prototype.finish = function() {
    // Return the possible parsings
    var considerations = [];
    var myself = this;
    this.table[this.table.length-1].forEach(function (t) {
        if (t.rule.name === myself.start
                && t.expect === t.rule.symbols.length
                && t.reference === 0
                && t.data !== Parser.fail) {
            considerations.push(t);
        }
    });
    return considerations.map(function(c) {return c.data; });
};

var nearley = {
    Parser: Parser,
    Rule: Rule
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = nearley;
} else {
   window.nearley = nearley;
}
})();

},{}],11:[function(require,module,exports){
/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

module.exports = function normalizePath(str, stripTrailing) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }
  str = str.replace(/[\\\/]+/g, '/');
  if (stripTrailing !== false) {
    str = str.replace(/\/$/, '');
  }
  return str;
};

},{}],12:[function(require,module,exports){
module.exports={"package":"0.7.0","format":1}
},{}]},{},[1])(1)
});