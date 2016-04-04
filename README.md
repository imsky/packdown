# Packdown

Packdown stores files inside Markdown documents.

[![Build Status](https://travis-ci.org/imsky/packdown.svg?branch=master)](https://travis-ci.org/imsky/packdown)
[![codecov.io](https://codecov.io/github/imsky/packdown/coverage.svg?branch=master)](https://codecov.io/github/imsky/packdown)

## Installing

* [npm](https://www.npmjs.com/package/packdownjs): `npm install -g packdownjs`

## Usage

Save the following as `example.md`:

<pre>
&#35;&#35; /hello
&#96;&#96;&#96;
hello world!
&#96;&#96;&#96;
</pre>

### Extract with CLI

```bash
packdown extract example.md
```

### Parse with library
```js
var fs = require('fs');
var packdown = require('packdownjs');
var doc = packdown.read(fs.readFileSync('example.md', 'utf8'));
```

## Source

* GitHub: <https://github.com/imsky/packdown>
* GitLab: <https://gitlab.com/imsky/packdown>

## License

Packdown is provided under the [MIT License](http://opensource.org/licenses/MIT).

## Credits

Thanks to [@hardmath123](https://github.com/Hardmath123) for help with the parser grammar.

Packdown is a project by [Ivan Malopinsky](http://imsky.co).
