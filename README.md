# Packdown

Packdown stores files inside Markdown documents.

[![Build Status](https://travis-ci.org/imsky/packdown.svg?branch=master)](https://travis-ci.org/imsky/packdown)
[![codecov.io](https://codecov.io/github/imsky/packdown/coverage.svg?branch=master)](https://codecov.io/github/imsky/packdown)

## Installation

* [npm](https://www.npmjs.com/package/packdownjs): `npm install -g packdownjs`

## Functions

<dl>
<dt><a href="#read">read(input, options)</a> ⇒</dt>
<dd><p>Generate document object from text input.</p>
</dd>
<dt><a href="#write">write(document)</a> ⇒</dt>
<dd><p>Generate Packdown document from document object.</p>
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
