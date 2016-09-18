# Packdown

Packdown stores files inside Markdown documents.

[![Build Status](https://travis-ci.org/imsky/packdown.svg?branch=master)](https://travis-ci.org/imsky/packdown)
[![codecov.io](https://codecov.io/github/imsky/packdown/coverage.svg?branch=master)](https://codecov.io/github/imsky/packdown)

## Installation

* [npm](https://www.npmjs.com/package/packdownjs): `npm install -g packdownjs`

## Command line usage

```

  Usage: packdown [options] [command]


  Commands:

    compress <input> [output]         
    extract [options] <input> <output>

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:
    compress <input> [output]
      $ packdown compress foo bar  # compresses foo dir into bar file
      $ packdown compress foo      # compresses foo dir, sends to stdout
    extract [options] <input> <output>
      $ packdown extract foo bar   # extracts foo file into bar directory
      # templates foo file with vars.json, then extracts into bar directory
      $ packdown extract -v vars.json foo bar

```

## Functions

<dl>
<dt><a href="#read">read(input, options)</a> ⇒</dt>
<dd><p>Generate document object from text input.</p>
</dd>
<dt><a href="#write">write(document)</a> ⇒</dt>
<dd><p>Generate Packdown document from document object.</p>
</dd>
<dt><a href="#filesToDoc">filesToDoc(root, files)</a> ⇒</dt>
<dd><p>Convert a set of files to a document object.</p>
</dd>
<dt><a href="#template">template(template, variables)</a> ⇒</dt>
<dd><p>Render a Mustache template.</p>
</dd>
</dl>

<a name="read"></a>

## read(input, options) ⇒
Generate document object from text input.

**Kind**: global function  
**Returns**: Document object  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>String</code> |  |
| options | <code>Object</code> | {disableSpaceEncoding} |

**Example**  
```js
var input = ['# /foo', '\`\`\`', 'content', '\`\`\`'].join('\n');
var output = packdown.read(input);
```
<a name="write"></a>

## write(document) ⇒
Generate Packdown document from document object.

**Kind**: global function  
**Returns**: String  

| Param | Type | Description |
| --- | --- | --- |
| document | <code>Object</code> | object |

**Example**  
```js
var document = {
  'files': {
    'foo': {
      'name': 'foo',
      'content': 'bar'
    }
  },
  'content': [{
    'file': 'foo'
  }]
};
var output = packdown.write(document);
```
<a name="filesToDoc"></a>

## filesToDoc(root, files) ⇒
Convert a set of files to a document object.

**Kind**: global function  
**Returns**: Document object  

| Param | Type | Description |
| --- | --- | --- |
| root | <code>String</code> | Root directory |
| files | <code>Array</code> | An array of file objects with at least a path and a content property |

**Example**  
```js
var root = '/foo';
var files = [{'content': 'bar', 'path': '/foo/bar'}];
var document = packdown.filesToDoc(root, files);
```
<a name="template"></a>

## template(template, variables) ⇒
Render a Mustache template.

**Kind**: global function  
**Returns**: String  

| Param | Type | Description |
| --- | --- | --- |
| template | <code>String</code> | The template to render |
| variables | <code>Object</code> | The values used within template |

**Example**  
```js
var template = '{{foo}}';
var variables = {
 'foo': 'bar'
};
var output = packdown.template(template, variables);
```

## Building

Packdown uses npm scripts and [shelljs](https://github.com/shelljs/shelljs) for building.

```
npm run build
```

## Testing

Packdown uses [Mocha](https://github.com/mochajs/mocha) and [Istanbul](https://github.com/gotwarlost/istanbul) for testing and coverage.

```
npm test
```

## Source

* GitHub: <https://github.com/imsky/packdown>
* GitLab: <https://gitlab.com/imsky/packdown>

## License

Packdown is provided under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Packdown is a project by [Ivan Malopinsky](http://imsky.co).
