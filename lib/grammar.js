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
